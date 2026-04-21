# 💳 Wallet Transaction System (Next.js + TypeScript)

A simple transaction system that maintains a wallet for each client.  
Admins can credit/debit wallets, and clients can create orders that deduct balance and trigger a fulfillment API.


All End-Point Testing on Postman - 

LINK:
https://assignment-1766.postman.co/workspace/assignment-Workspace~bc31010f-d916-43a4-8af7-21d4b425949e/collection/37660152-9dce8274-a9be-4de4-a2a5-d376d8656f22?action=share&creator=37660152&active-environment=37660152-c955f2c5-e2c8-485a-867d-474e891368a2
---

## 🚀 Tech Stack

- Next.js (App Router)
- TypeScript
- In-memory storage (No database)

---

## 📁 Project Structure
<img width="357" height="863" alt="image" src="https://github.com/user-attachments/assets/7cd08a12-a31e-4eb9-a737-b0d241052d76" />

###Prompts during development

1. Based on this end-point gives me command to create in this hierarchy of folder for end-points
2. help me regarding making in-memory storage
3. gives me bolierplate code for GET & POST request code for nextjs+tsx api-endpoints

---
## 🧠 Core Concepts

### 1. In-Memory Storage

Used simple JavaScript objects to store:
- Wallet balances (`wallets`)
- Orders (`orders`)
- Ledger entries (`ledger`)

This avoids database complexity and keeps the system fast and simple, as the assignment did not require persistent storage.

---

### 2. Atomic Operations (Concurrency Handling)

To prevent race conditions (e.g., multiple requests modifying the same wallet at the same time), a **per-client locking mechanism** is implemented.

Each operation:
1. Acquires a lock for the client
2. Performs the wallet update
3. Releases the lock

---

### 3. Order Processing Flow

When a client creates an order:

1. Validate wallet balance  
2. Acquire lock (atomic operation)  
3. Deduct amount from wallet  
4. Create order with `pending` status  
5. Call external fulfillment API  
6. Store returned `fulfillment_id`  
7. Update order status to `completed`  
8. Release lock  

---

### 4. External API Integration

The system integrates with a mock fulfillment API:

POST https://jsonplaceholder.typicode.com/posts
payload:
{
"userId": "<CLIENT_ID>",
"title": "<ORDER_ID>"
}


The response contains an `id` which is stored as `fulfillment_id` in the order.

---

### 5. Access Control (Basic Validation)

- Orders can only be accessed by the client who created them
- Implemented using `client-id` header
- Prevents unauthorized data access

---

### 6. Error Handling

Handled key edge cases:
- Invalid input (missing fields, negative amount)
- Insufficient wallet balance
- Missing headers
- Order not found
- External API failure


---
