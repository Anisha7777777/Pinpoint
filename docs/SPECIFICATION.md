# Pinpoint product specification and roadmap

## Product

Developers and testers document bugs, manually record reproduction attempts, propose fixes and verify specific fixes in recorded environments. A bug detail page ties together the report, evidence, reproduction matrix and chronological history. A failed reproduction is not proof of invalidity. One passing environment does not imply global success.

## Planned permissions

| Action | Owner | Developer | Tester |
| --- | --- | --- | --- |
| Manage project and membership | Yes | No | No |
| Read project, report bugs, record reproduction | Yes | Yes | Yes |
| Edit report and assign project members | Yes | Yes | Yes |
| Submit fix | Yes | Yes | No |
| Record verification | Yes | Yes | Yes |
| Explicit close with passing verification / reopen | Yes | No | Yes |

Roles are project scoped. Any registered user may create a project and become its owner. The initial owner is fixed; transfer/deletion is outside initial membership management. Owners add existing users, change developer/tester roles and remove members. All access requires server-side membership checks. Demo role controls must never substitute for authorization.

## Planned collections

All records have `_id` and timestamps. Project-owned records carry `projectId`, and the server checks every referenced record's project. IDs received from the client are not proof of access.

| Collection | Principal fields and relationships |
| --- | --- |
| users | normalized unique email, displayName, passwordHash (never returned) |
| projects | name, description, ownerId → user |
| memberships | projectId, userId → user, role; unique projectId/userId |
| bugs | projectId, reporterId, assigneeId?, title, description, expectedBehavior, actualBehavior, embedded ordered steps, severity, status, currentFixId?, closureVerificationId?, version |
| reproductionAttempts | projectId, bugId, authorId, embedded environment, outcome, notes |
| proposedFixes | projectId, bugId, authorId, manually entered commit/PR URL, immutable target revision/build identifier, notes |
| verifications | projectId, bugId, fixId, authorId, embedded environment including actual build tested, outcome, notes |
| attachments | projectId, parentType (attempt/verification), parentId, uploaderId, private object key, content type, byte size, upload state |
| activityEvents | projectId, bugId?, actorId, eventType, bounded event payload, timestamp |

Environment snapshots contain browser/name/version, operating system/name/version and application version. They are embedded because the historical tested context must not change when someone's current machine changes. Bug steps are a bounded ordered list owned by the report. Independent collections hold unbounded evidence history; references prevent oversized bug documents. Attachment binaries belong in private object storage, not MongoDB. No public bucket URLs; authorize access before issuing short-lived signed URLs. Validate size/type and finalize uploads before exposing evidence.

Attempt, fix and verification evidence is append-only in the MVP. Later corrections require a new record and explanatory note, preserving the previous result. Project members may read retained evidence even if its author subsequently leaves.

## Lifecycle and integrity

- Bug status: `open`, `in_progress`, `in_verification`, `closed`.
- Reproduction: `reproduced`, `not_reproduced`, `inconclusive`.
- Verification: `passed`, `failed`, `inconclusive`.
- Neither outcome type automatically changes status. UI and API present these concepts separately.
- Every verification identifies a fix and the environment/build tested. A fix submission requires a concrete target revision/build, even when its URL points to a moving PR.
- Owner/tester closure explicitly selects a passing verification belonging to that bug and its current proposed fix. Save its ID on the bug with the decision. This proves a scoped result, not all-environment coverage.
- Changing the current fix invalidates eligibility of older-fix evidence for closure; retain that evidence. A closed bug must be reopened before replacing its current fix or recording new lifecycle decisions.
- Reopening clears the current closure pointer, records the reason and event, and retains prior closure events, attempts and verifications.
- Version-checked bug updates return 409 for stale writes; the UI asks the user to reload and review rather than silently overwrite.
- Use MongoDB transactions for lifecycle changes and corresponding events, with a replica-set-capable local/test database. Include version checks on referenced mutable lifecycle state.
- Reject cross-project references, assignees outside the project, invalid state transitions and unauthorized operations. Test these cases as implemented.
- Matrix groups normalized browser/version, OS/version and app version. Display observations and conflicting results rather than flattening history into an overall pass. Fix verification rows identify their fix. No observations means untested, never passed.

## Screens

Signup/login; projects and filtered dashboard; new/edit report; bug detail with attempts, environment matrix, fixes, verification and history; membership/settings. Provide responsive layouts plus accessible loading, empty, success, validation and network error states. Phase 1 shows only the responsive shell and synthetic preview.

## Phases and exit criteria

1. **Foundation:** runnable npm workspace, React/TS/Vite/Tailwind shell, Express/TS health, development proxy, liveness contract checks, build/type checks and local setup documentation. Stop here for this delivery.
2. **Identity/access:** Mongoose, input validation, password hashing, expiring JWT in HttpOnly cookies, logout, protected routes, project membership and server authorization. Decide cookie SameSite/Secure settings, CSRF/origin protection and token revocation policy before implementation. Test missing/expired sessions, membership and project isolation. No tokens in localStorage.
3. **Reports/reproduction:** validated CRUD and assignment, manual reproduction evidence, private attachments, matrix and dashboard filters (status, severity, assignee, reproduction outcome). Add version conflict and storage authorization tests.
4. **Fix/lifecycle:** manual fix links plus target identifiers, fix-specific verification, explicit closure/reopen rules and transactional activity events. Test closure evidence scope, permissions, stale writes, cross-project references and history preservation.
5. **Portfolio:** synthetic seed data and demo accounts/roles, safe demo reset strategy, complete responsive/accessibility and workflow checks, clear documentation. No invented usage/performance claims.

Excluded: AI, browser execution, payments, microservices, Kubernetes and real-time functionality. Socket.IO and GitHub integration are optional future work. No deployment is authorized in this delivery.
