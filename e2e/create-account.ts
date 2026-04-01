export async function createAccount(email: string, password: string) {
  console.log(`[E2E-Setup] Attempting to create account for: ${email}`);
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
    const response = await fetch(`${apiUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, fullName: 'Test User' }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      if (response.status === 400 && errorData.error === 'Email already exists') {
        console.log(`[E2E-Setup] User already exists: ${email}`);
        return;
      }

      throw new Error(`Registration failed: ${response.status} ${JSON.stringify(errorData)}`);
    }

    console.log(`[E2E-Setup] Successfully created account: ${email}`);
  } catch (error) {
    console.error(`[E2E-Setup-Error] ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw error;
  }
}
