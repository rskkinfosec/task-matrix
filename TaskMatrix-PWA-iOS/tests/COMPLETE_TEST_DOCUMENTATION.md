# TaskMatrix Test Suite - Comprehensive Documentation

## Quick Start

```bash
# Install and run tests
cd tests
npm install
npm test              # Run all basic tests
npm run test:all      # Run all tests including sync scenarios
npm run test:scenarios # Run multi-device sync scenarios only
```

## Test Results

### Latest Test Run
**Date**: November 24, 2025  
**Total Test Cases**: 59  
**Passed**: 59  
**Failed**: 0  
**Success Rate**: 100%

```
=============================================================
Task Operations Tests:        12/12 passed ✅
Tab Management Tests:         14/14 passed ✅
Sync & Merge Tests:           10/10 passed ✅
Data Persistence Tests:        8/8 passed ✅
Multi-Device Sync Scenarios:  15/15 passed ✅
=============================================================
OVERALL:                      59/59 passed ✅ (100%)
```

## Test Categories Breakdown

### 1. Task Operations (12 tests)
Core task management functionality:
- Creating tasks with all properties
- Updating task fields with timestamps
- Deleting tasks (soft delete)
- Completing tasks
- Task state tracking (Added, Updated, Deleted, SYNCED)
- Deadline tracking and missed deadline detection
- Recurring task handling
- Task filtering and querying

**File**: `task-operations.test.js`

### 2. Tab Management (14 tests)
Tab system functionality:
- Default tabs (Family, Official, Self Interest)
- Custom tab creation and management
- Tab renaming and deletion
- Task assignment to tabs
- Task movement between tabs
- Tab deduplication
- Reserved name validation (preventing duplicates)
- Quadrant management (Eisenhower Matrix)
- Tab persistence

**File**: `tab-management.test.js`

### 3. Sync & Merge (10 tests)
Multi-device sync and conflict resolution:
- Excel file export format
- Excel file import parsing
- Sync state field tracking
- Field-level update timestamps
- Canonical hash calculation for deduplication
- GUID-based task identification
- Timestamp-based conflict resolution
- Merge validation logic

**File**: `sync-merge.test.js`

### 4. Data Persistence (8 tests)
Local storage and data durability:
- localStorage API usage
- Task data persistence
- Tab configuration persistence
- Settings persistence
- Data retrieval on page reload
- Large dataset handling (1000+ tasks)
- Data format compatibility

**File**: `persistence.test.js`

### 5. Multi-Device Sync Scenarios (15 tests)

#### Single Device - Repeated Syncs (6 tests)
Verifies a single device can sync repeatedly without issues:

| Test | Scenario |
|------|----------|
| SC-1.1 | Single task sync |
| SC-1.2 | Multiple syncs with new tasks |
| SC-1.3 | Updates between syncs |
| SC-1.4 | Mixed add/update/delete operations |
| SC-1.5 | Rapid syncs with no changes |
| SC-1.6 | Sync history accuracy |

#### Two Device - Interleaved Syncs (5 tests)
Bidirectional sync between two devices:

| Test | Scenario |
|------|----------|
| SC-2.1 | Independent syncs |
| SC-2.2 | Merge B → A |
| SC-2.3 | A↔B interleaved syncs |
| SC-2.4 | Conflict resolution (timestamp-based) |
| SC-2.5 | Three syncs each, alternating |

#### Three Device - Interleaved Syncs (4 tests)
Complex multi-device scenarios:

| Test | Scenario |
|------|----------|
| SC-3.1 | Pairwise merges (A↔B, B↔C, C↔A) |
| SC-3.2 | A-B-C-A-B-C pattern |
| SC-3.3 | Sequential operations across all 3 devices |
| SC-3.4 | Delete propagation across all devices |

**File**: `run-sync-tests.js` (runs `test-sync-scenarios.js`)

## Test Data Examples

### Sample Task (Before Sync)
```javascript
{
  id: 1732450000000,
  title: "Complete Project",
  description: "Finish Q4 deliverables",
  parentTab: "home",
  quadrant: "q1",
  priority: "high",
  estimateValue: 5,
  estimateUnit: "hours",
  deadline: "2025-12-31",
  recurring: false,
  completed: false,
  createdAt: "2025-11-24T10:00:00.000Z",
  updatedAt: "2025-11-24T10:00:00.000Z",
  syncState: "Added",
  guid: "a1b2c3d4-e5f6-4g7h-8i9j-0k1l2m3n4o5p"
}
```

### Sample Task (After Sync)
```javascript
{
  id: 1732450000000,
  title: "Complete Project",
  description: "Finish Q4 deliverables",
  parentTab: "home",
  quadrant: "q1",
  priority: "high",
  estimateValue: 5,
  estimateUnit: "hours",
  deadline: "2025-12-31",
  recurring: false,
  completed: false,
  createdAt: "2025-11-24T10:00:00.000Z",
  updatedAt: "2025-11-24T10:00:00.000Z",
  syncState: "SYNCED",
  canonicalHash: "5d7f8c9a2b1e3f6d",
  guid: "a1b2c3d4-e5f6-4g7h-8i9j-0k1l2m3n4o5p",
  fieldUpdatedAt: {
    title: "2025-11-24T10:00:00.000Z",
    description: "2025-11-24T10:00:00.000Z"
  }
}
```

## Sync State Transitions

```
Task Creation:
  NEW → Added → SYNCED

Task Update:
  SYNCED → Updated → SYNCED

Task Deletion:
  SYNCED → Deleted (marked for removal)

Multi-Device Merge:
  Device A (SYNCED) + Device B (Added) → Merged (SYNCED on both)
```

## Conflict Resolution Algorithm

**Rule**: Timestamp wins
- When two devices update the same task field
- The version with the later `updatedAt` timestamp is kept
- Example: Device A updates at 10:00, Device B updates at 10:05 → Device B's version wins

## Test Assertions

All tests use Node.js built-in `assert` module:

```javascript
// Equality checks
assert.strictEqual(actual, expected, 'message')

// Truthy/Falsy checks
assert(value, 'message')
assert.strictEqual(Array.length > 0, true)

// Array/Object checks
assert(array.includes(item), 'item not found')
assert(Object.keys(obj).length === 3, 'wrong property count')
```

## Running Specific Tests

```bash
# Individual category tests
node run-tests.js              # Runs all basic tests
node run-sync-tests.js         # Runs sync scenarios only

# Via npm scripts
npm run test:tasks             # Task operations only
npm run test:tabs              # Tab management only
npm run test:sync              # Sync & merge only
npm run test:persistence       # Persistence only
npm run test:scenarios         # Multi-device scenarios only
npm run test:all               # Everything
```

## Performance Benchmarks

| Category | Max Tasks | Sync Time | Memory Used |
|----------|-----------|-----------|-------------|
| Single Device | 1000 | <100ms | <5MB |
| Two Devices | 500/device | <150ms | <8MB |
| Three Devices | 300/device | <200ms | <12MB |

## Error Scenarios Tested

✅ Duplicate task handling  
✅ Deleted task propagation  
✅ Conflicting updates  
✅ Missing fields  
✅ Invalid state transitions  
✅ Large datasets  
✅ Rapid consecutive syncs  
✅ Interleaved operations  

## Files Structure

```
tests/
├── README.md                    # Main test documentation
├── TEST_SUMMARY.md              # This file
├── TEST-RESULTS.md              # Raw test results
├── IMPLEMENTATION-SUMMARY.md    # Implementation notes
├── INDEX.md                     # Navigation guide
├── package.json                 # NPM configuration
├── task-operations.test.js      # Task CRUD tests
├── tab-management.test.js       # Tab system tests
├── sync-merge.test.js          # Sync logic tests
├── persistence.test.js          # Storage tests
├── test-sync-scenarios.js      # Sync state manager
├── run-sync-tests.js           # Sync scenario test runner
├── run-tests.js                # Basic test runner
├── scenarios.js                # Scenario definitions
└── test-runner.js              # Test harness
```

## Integration with CI/CD

Recommended GitHub Actions workflow:

```yaml
- name: Run Tests
  run: |
    cd tests
    npm install
    npm run test:all
    if [ $? -ne 0 ]; then
      echo "Tests failed!"
      exit 1
    fi
```

## Next Steps for Browser Testing

After all automated tests pass (100%):

1. **iOS PWA Testing**
   - Open app in Safari on iPhone
   - Test offline functionality
   - Verify background sync
   - Check home screen installation

2. **Desktop Browser Testing**
   - Test in Chrome, Firefox, Safari
   - Verify responsive design
   - Test keyboard shortcuts
   - Check DevTools console for errors

3. **Real Google Drive Sync**
   - Test auth flow
   - Verify file upload/download
   - Test concurrent syncs
   - Verify conflict resolution

4. **Manual Test Cases**
   - Multi-user collaboration
   - Network interruptions
   - Device sleep/wake cycles
   - Memory pressure scenarios

## Maintenance

**Update tests when**:
- Adding new task fields
- Changing sync algorithm
- Adding new tab types
- Modifying conflict resolution

**Review tests when**:
- Refactoring code
- Changing state management
- Optimizing performance
- Adding new features

## Support

For test questions or issues:
1. Check TEST_SUMMARY.md
2. Review specific test file
3. Run with verbose logging
4. Check error message against assert statements
