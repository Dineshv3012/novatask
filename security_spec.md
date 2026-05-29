# Security Specification: NovaTask AI Attribute-Based Access Control

This security specification details the access control models, structural data invariants, and defensive validation rules mapped out for the NovaTask AI Firestore database.

## 1. Data Invariants & Zero-Trust Policies
- **User Privacy**: Single-user PII isolation. No anonymous user or external authenticated users can access, search, or mutate other users' profiles, task lists, or private statistics.
- **Relational Integrity**: A Task can only be created by an authenticated user, and `createdBy` must match the authenticated `request.auth.uid`.
- **System Integrity (No Client Manipulation)**: System-generated fields or admin roles are strictly protected. Users cannot escalate their own `role` during profile creation or update.
- **Strict Key Checking & Size Bounds**: Prevention of shadow fields or payload injection through size-bounded assertions on all map inputs.

## 2. The "Dirty Dozen" Payloads (ABAC Attacks Blocking Definition)
Below are 12 malicious payloads that NovaTask AI security rules are engineered to block:

1. **Malicious Role Escalation**:
   ```json
   { "uid": "attacker_id", "email": "attacker@gmail.com", "role": "admin" }
   ```
2. **Identity Spoofing (Write as another user)**:
   ```json
   { "taskId": "task_1", "createdBy": "victim_uid", "title": "Injected Task" }
   ```
3. **Ghost Field Injection (Shadow properties)**:
   ```json
   { "taskId": "task_2", "createdBy": "attacker_id", "status": "Pending", "ghost_param_hack": "malware" }
   ```
4. **Denial of Wallet (ID Poisoning)**:
   - Creating documents with 1MB keys or path arguments containing foreign/malicious scripts.
5. **No Verification Bypass**:
   - Performing private actions when `request.auth.token.email_verified` is `false`.
6. **Task Hijacking**:
   - Updating `createdBy` or `taskId` fields in an existing task document.
7. **PII Collection Gathering**:
   - Querying a blanket list of all users' profiles without explicit, single-profile key query bounds.
8. **Negative Length or Size Attacks**:
   - Inserting strings size > 10000 or array lists with unbounded items.
9. **Notification Flooding**:
   - Flooding the global notification collection with system alerts or notification IDs claiming to be from the server.
10. **Activity Log Tampering**:
    - Overwriting logs of past actions to erase security audit trails.
11. **Immutability Breach**:
    - Changing `createdAt` field on an existing task.
12. **Status Lockout Violation**:
    - Forcing a forbidden status jump or editing fields of a completed task once status equals `Completed`.

## 3. Security Assertions and Automated Checks
The `firestore.rules` are configured to intercept and isolate all 12 threats.
- Default deny: `allow read, write: if false;`
- Strict verification checks: `request.auth.token.email_verified == true` where appropriate.
- Named is[Entity] helpers that validate size, type, presence of keys, and matching ids.
