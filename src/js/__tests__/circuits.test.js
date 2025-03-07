/* eslint-disable no-undef */
import { getUserToCircuitDistance } from "../circuits.js";

test("getUserToCircuitDistance", async () => {
    expect(await getUserToCircuitDistance({ latitude: 0, longitude: 0 }, [0, 0])).toBe(0);
});

test("getUserToCircuitDistance", async () => {
    expect(await getUserToCircuitDistance({ latitude: 50, longitude: 50 }, [40, 40])).toBe(1359.3);
});