# TaskMatrix Test Suite

Comprehensive test suite for TaskMatrix PWA covering task operations, tab management, sync/merge, and data persistence.

## Overview

The test suite includes **50+ test cases** covering:

- ✅ Task CRUD operations (Create, Read, Update, Delete)
- ✅ Tab management and deduplication
- ✅ Sync operations and conflict resolution
- ✅ Multi-device simulation (parallel modifications)
- ✅ Data persistence and state recovery
- ✅ Error handling and edge cases

## Test Suites

### 1. Task Operations (`task-operations.test.js`)
Tests for task creation, updating, deletion, and state management.

**Test Cases:**
- Create single task
- Create multiple tasks
- Update task fields
- Delete tasks
- Error handling (non-existent tasks)
- UUID generation and uniqueness
- Timestamp accuracy

### 2. Tab Management (`tab-management.test.js`)
Tests for tab creation, deletion, deduplication, and sync from Drive.

**Test Cases:**
- Create custom tabs
- Prevent reserved tab names (Family, Official, Self Interest)
- Prevent duplicate tabs
- Delete custom tabs
- Prevent deletion of default tabs
- Tab deduplication
- Sync from Drive sheets
- Display name mapping (Family → home)

### 3. Sync & Merge (`sync-merge.test.js`)
Tests for multi-device sync, conflict detection, and merge operations.

**Test Cases:**
- Add local and remote tasks
- Merge new remote tasks
- Skip merging older versions
- Merge multiple tasks
- Detect title conflicts
- Detect description conflicts
- GUID-based deduplication
- Parallel modifications from Device A
- Parallel modifications from Device B
- Cross-device merge
- Conflict resolution (take newer version)

### 4. Persistence & State (`persistence.test.js`)
Tests for data persistence, validation, and recovery.

**Test Cases:**
- Save and load tasks
- Save and load custom tabs (excluding defaults)
- Auth token persistence
- Expired token handling
- Data validation
- Invalid data detection
- Default tab filtering
- Data recovery from corruption

## Running Tests

### Prerequisites
```bash
Node.js 12+ installed
```

### Run All Tests
```bash
cd tests
node run-tests.js
```

### Run Specific Test Suite
```bash
node task-operations.test.js
node tab-management.test.js
node sync-merge.test.js
node persistence.test.js
```

## Test Output Example

```
================================================================================
🧪 TASKMATRIX TEST SUITE
================================================================================

📋 Test Suite: Task Operations
--------------------------------------------------------------------------------
  ✅ Should create a task
  ✅ Should create multiple tasks
  ✅ Should update task fields
  ✅ Should delete a task
  ✅ Should throw error when updating non-existent task
  ✅ Should throw error when deleting non-existent task
  ✅ Should generate unique GUIDs
  ✅ Should set correct timestamps

📋 Test Suite: Tab Management
--------------------------------------------------------------------------------
  ✅ Should create a custom tab
  ✅ Should create multiple custom tabs
  ✅ Should prevent creating tab with reserved name "Family"
  ✅ Should prevent creating tab with reserved name "Official"
  ✅ Should prevent creating tab with reserved name "Self Interest"
  ✅ Should prevent creating duplicate tabs
  ✅ Should delete custom tab
  ✅ Should prevent deleting default tabs
  ✅ Should get all tabs (default + custom)
  ✅ Should deduplicate tabs by name
  ✅ Should sync sheets from Drive and create only new custom tabs
  ✅ Should not create duplicate tabs during sync from Drive
  ✅ Should map display names to default tabs during sync

[... more test suites ...]

================================================================================
📊 TEST SUMMARY
================================================================================
Total Tests:    50+
Passed:         50+ ✅
Failed:         0 ❌
Pass Rate:      100%
================================================================================
```

## Key Features

### Task Management
- Unique GUID generation for each task
- Canonical hash for deduplication
- Sync state tracking (Added, Updated, Deleted, SYNCED)
- Timestamp tracking (createdAt, updatedAt, fieldUpdatedAt)

### Tab Management
- Reserved tab name validation
- Default tab separation (home, official, self)
- Deduplication by normalized name
- Display name mapping from Drive sheets

### Sync & Merge
- GUID-based conflict detection
- Timestamp-based conflict resolution
- Multi-device simulation
- Merge strategy: "take newer"

### Data Persistence
- LocalStorage simulation
- Token expiry validation
- Data structure validation
- Corruption recovery

## Simulated Multi-Device Scenarios

The test suite simulates real-world scenarios:

1. **Device A**: Creates tasks locally
2. **Device B**: Creates different tasks locally
3. **Device A**: Pulls from Drive, merges Device B's tasks
4. **Device B**: Pulls from Drive, merges Device A's tasks

### Conflict Scenarios Tested
- Same task modified on both devices (uses newer timestamp)
- Parallel task creation (merged by GUID)
- Tab duplication prevention
- State recovery after network issues

## Data Models

### Task
```javascript
{
    id: number,
    title: string,
    description: string,
    parentTab: string,
    guid: uuid,
    canonicalHash: string,
    syncState: 'Added' | 'Updated' | 'Deleted' | 'SYNCED',
    createdAt: timestamp,
    updatedAt: timestamp,
    fieldUpdatedAt: object
}
```

### Tab
```javascript
{
    id: string,
    name: string,
    isDefault?: boolean
}
```

### AuthToken
```javascript
{
    token: string,
    expiry: timestamp
}
```

## Debugging Tests

Add verbose logging by modifying test cases:

```javascript
'Should create a task': () => {
    const task = model.createTask({ title: 'Test' });
    
    console.log('Created task:', JSON.stringify(task, null, 2));
    
    assert.strictEqual(task.title, 'Test');
}
```

## CI/CD Integration

To integrate with CI/CD:

```bash
#!/bin/bash
cd tests
node run-tests.js
exit_code=$?

if [ $exit_code -eq 0 ]; then
    echo "✅ All tests passed"
else
    echo "❌ Tests failed"
fi

exit $exit_code
```

## Future Test Coverage

Planned test additions:
- [ ] Quadrant-based task organization
- [ ] Priority level handling
- [ ] Recurring task logic
- [ ] Deadline and notification handling
- [ ] Offline mode behavior
- [ ] Rate limiting and throttling
- [ ] Large dataset performance
- [ ] Memory leak detection

## Notes

- Tests are isolated and don't require actual Google Drive access
- Each test suite can run independently
- No browser required
- Fast execution (typically < 1 second)
- Clear pass/fail reporting with detailed error messages
