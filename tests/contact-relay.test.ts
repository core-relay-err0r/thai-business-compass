import { afterEach, beforeEach, expect, it, vi } from "vitest";
import handler from "../api/contact";
import { sendProtocolCopy } from "../api/_protocol-copy";

vi.mock("../api/_protocol-copy", () => ({ sendProtocolCopy: vi.fn() }));

const fetchMock = vi.fn();
const body = {
  fullName: "PND50 LOCAL TEST",
  email: "local-test@example.com",
  message: "Mocked transport only",
  attribution: { utm_source: "qa", utm_campaign: "pnd50_local", landing_path: "/services" },
};

function response() {
  return {
    setHeader: vi.fn(),
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
    send: vi.fn().mockReturnThis(),
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubGlobal("fetch", fetchMock);
  vi.spyOn(console, "warn").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
  vi.mocked(sendProtocolCopy).mockResolvedValue({ id: "mock-copy-id" });
});
afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks(); });

it("forwards attribution and keeps the upstream acceptance contract", async () => {
  fetchMock.mockResolvedValue(new Response(JSON.stringify({ success: true, internalDelivered: true })));
  const res = response();
  await handler({ method: "POST", body }, res);
  expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual(body);
  expect(sendProtocolCopy).toHaveBeenCalledWith(expect.objectContaining({ payload: body }));
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith({ success: true, internalDelivered: true, protocolCopyDelivered: true });
});

it("preserves accepted status if the optional copy throws", async () => {
  fetchMock.mockResolvedValue(new Response(JSON.stringify({ success: true, internalDelivered: true })));
  vi.mocked(sendProtocolCopy).mockRejectedValue(new Error("mock provider unavailable"));
  const res = response();
  await handler({ method: "POST", body }, res);
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith({ success: true, internalDelivered: true, protocolCopyDelivered: false });
});

it("does not claim delivery when the optional copy returns null", async () => {
  fetchMock.mockResolvedValue(new Response(JSON.stringify({ success: true, internalDelivered: true })));
  vi.mocked(sendProtocolCopy).mockResolvedValue(null);
  const res = response();
  await handler({ method: "POST", body }, res);
  expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ protocolCopyDelivered: false, success: true }));
});

it.each(["", "not json", "null", "[]", '{"success":true}', '{"success":false,"internalDelivered":true}'])(
  "fails closed on an unconfirmed response: %s", async (text) => {
    fetchMock.mockResolvedValue(new Response(text));
    const res = response();
    await handler({ method: "POST", body }, res);
    expect(res.status).toHaveBeenCalledWith(502);
    expect(sendProtocolCopy).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ error: "Enquiry acceptance was not confirmed" });
  });

it("passes through a rejected enquiry without sending a copy", async () => {
  fetchMock.mockResolvedValue(new Response('{"error":"Invalid email"}', { status: 400 }));
  const res = response();
  await handler({ method: "POST", body }, res);
  expect(res.status).toHaveBeenCalledWith(400);
  expect(sendProtocolCopy).not.toHaveBeenCalled();
});

it("handles an upstream transport failure without a copy", async () => {
  fetchMock.mockRejectedValue(new Error("mock network failure"));
  const res = response();
  await handler({ method: "POST", body }, res);
  expect(res.status).toHaveBeenCalledWith(500);
  expect(sendProtocolCopy).not.toHaveBeenCalled();
});

it("rejects non-POST without invoking any external service", async () => {
  const res = response();
  await handler({ method: "GET" }, res);
  expect(res.status).toHaveBeenCalledWith(405);
  expect(fetchMock).not.toHaveBeenCalled();
  expect(sendProtocolCopy).not.toHaveBeenCalled();
});
