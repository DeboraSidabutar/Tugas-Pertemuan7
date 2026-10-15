const assert = require("node:assert/strict");

const BASE_URL = "https://belajar-bareng.onrender.com";

const LOGIN_ENDPOINT = "/api/login";
const GET_USER_ENDPOINT = "/api/users";
const ADD_USER_ENDPOINT = "/api/add-user";

let token;

async function sendRequest(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body
        ? { "Content-Type": "application/json" }
        : {}),
      ...(options.headers || {}),
    },
  });

  const text = await response.text();
  let body;

  try {
    body = JSON.parse(text);
  } catch {
    body = text;
  }

  return {
    status: response.status,
    body,
  };
}

describe("Tugas Pertemuan 7 - Debora Sidabutar", function () {
  this.timeout(15000);

  // ==========================================
  // 1. POST LOGIN - POSITIVE CASE
  // ==========================================
  it("POST Login - login berhasil", async function () {
    const result = await sendRequest(LOGIN_ENDPOINT, {
      method: "POST",
      body: JSON.stringify({
        username: "admin",
        password: "admin",
      }),
    });

    // Assert 1: Memeriksa status code
    assert.equal(
      result.status,
      200,
      "Login mengembalikan status 200"
    );

    // Assert 2: Memeriksa response body dan format JWT
    assert.ok(
      result.body &&
        result.body.status === 200 &&
        result.body.message === "Login successful" &&
        typeof result.body.token === "string" &&
        /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(
          result.body.token
        ),
      "Login berhasil dan token memiliki format JWT yang benar"
    );

    token = result.body.token;
  });

  // ==========================================
  // 2. GET USER - POSITIVE CASE
  // ==========================================
  it("GET User - mengambil data user", async function () {
    assert.ok(token, "Token harus tersedia dari proses login");

    const result = await sendRequest(GET_USER_ENDPOINT, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Assert 1: Memeriksa status code
    assert.equal(
      result.status,
      200,
      "Users berhasil diakses"
    );

    // Assert 2: Memeriksa response body dan data user
    assert.ok(
      result.body &&
        result.body.status === 200 &&
        Array.isArray(result.body.users) &&
        result.body.users.every(
          (user) =>
            user &&
            typeof user.userId === "string" &&
            typeof user.username === "string" &&
            typeof user.age === "number"
        ),
      "Setiap user memiliki identitas yang lengkap"
    );
  });

  // ==========================================
  // 3. POST ADD USER - POSITIVE CASE
  // ==========================================
  it("POST Add User - data valid", async function () {
    assert.ok(token, "Token harus tersedia dari proses login");

    const uniqueId = Date.now();
    const username = `Debora_${uniqueId}`;

    const result = await sendRequest(ADD_USER_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        username: username,
        age: 34,
      }),
    });

    // Assert 1: Memeriksa status code
    assert.equal(
      result.status,
      201,
      "Status harus 201"
    );

    // Assert 2: Memeriksa response body
    assert.ok(
      result.body &&
        result.body.status === 201 &&
        typeof result.body.userId === "string" &&
        result.body.username === username &&
        typeof result.body.message === "string" &&
        result.body.message.includes("successfully added"),
      "Response berisi data user yang berhasil ditambahkan"
    );
  });

  // ==========================================
  // 4. POST ADD USER - NEGATIVE CASE
  // ==========================================
  it("POST Add User - data tidak valid", async function () {
    assert.ok(token, "Token harus tersedia dari proses login");

    const result = await sendRequest(ADD_USER_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        username: "",
        age: "",
      }),
    });

    // Assert 1: Memeriksa status code error
    assert.ok(
      [400, 422].includes(result.status),
      `Status harus 400 atau 422, diterima ${result.status}`
    );

    // Assert 2: Memeriksa response body error
    assert.ok(
      result.body !== null &&
        typeof result.body === "object" &&
        Boolean(
          result.body.message ||
            result.body.error ||
            result.body.errors
        ),
      "Response harus berisi pesan kesalahan"
    );
  });
});