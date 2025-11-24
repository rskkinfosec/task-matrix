# Test Suite Quick Reference

## One-Command Test Execution

```bash
cd tests && npm install && npm run test:all
```

## Test Coverage at a Glance

| Test Category | Tests | Status |
|---------------|-------|--------|
| Task Operations | 12 | ✅ PASS |
| Tab Management | 14 | ✅ PASS |
| Sync & Merge | 10 | ✅ PASS |
| Data Persistence | 8 | ✅ PASS |
| Multi-Device Sync | 15 | ✅ PASS |
| **TOTAL** | **59** | **✅ 100% PASS** |

## Key Test Scenarios

### Single Device (6 tests)
- Add tasks → Sync → Verify
- Add → Update → Sync
- Add → Update → Delete → Sync
- Rapid syncs with no changes
- Sync history accuracy

### Two Devices (5 tests)
- Device A adds, Device B adds → Merge
- Device A updates, Device B updates → Conflict resolution
- A-B-A-B alternating syncs
- Independent sync operations

### Three Devices (4 tests)
- All add, all merge (A↔B↔C)
- Complex A-B-C-A-B-C pattern
- Sequential operations
- Delete propagation

## Quick Test Commands

```bash
# Run all tests
npm test

# Run specific category
npm run test:tasks         # Task operations only
npm run test:tabs          # Tab management only
npm run test:sync          # Sync & merge only
npm run test:scenarios     # Multi-device scenarios only
npm run test:persistence   # Data persistence only

# Run everything
npm run test:all

# Verbose output
npm run test:verbose
```

## Test Results Summary Format

```
📋 Test Category Name
  ✅ Test 1 description
  ✅ Test 2 description
  ❌ Test 3 description
     Error: assertion failed

============================================================
📊 TEST SUMMARY
============================================================
Total Test Cases:  59
✅ Passed:         59
❌ Failed:         0
Success Rate:      100.00%
============================================================
```

## What Gets Tested

### Task Operations ✅
- Create, Read, Update, Delete
- State tracking (Added/Updated/Deleted/SYNCED)
- Timestamps and field updates
- Priorities and deadlines
- Recurring tasks
- Completion tracking

### Tab Management ✅
- Create custom tabs
- Rename/delete tabs
- Prevent reserved names (Family, Official, Self Interest)
- Task assignment to tabs
- Tab deduplication
- Quadrant/matrix organization

### Sync & Merge ✅
- Export tasks to Excel
- Import tasks from Excel
- GUID-based deduplication
- Hash-based duplicate detection
- Timestamp-based conflict resolution
- Field-level merge tracking

### Data Persistence ✅
- localStorage storage
- Data retrieval on reload
- Settings persistence
- Large dataset handling (1000+ tasks)

### Multi-Device Scenarios ✅
- Single device repeated syncs
- Two device bidirectional sync
- Three device complex merges
- Conflict resolution
- Delete propagation
- Interleaved operations

## Pre-Browser Testing Checklist

Before testing in iOS PWA or browser:

- [ ] Run `npm run test:all`
- [ ] Verify 59/59 tests pass
- [ ] Check success rate = 100%
- [ ] No error messages in output
- [ ] All test categories green (✅)

## Problem Solving

**If tests fail:**
1. Check error message in output
2. Run specific failing test
3. Review test code in corresponding file
4. Check sync state values
5. Verify timestamps are correctly ordered

**Common failures:**
- Timestamp not later than existing → Merge fails
- GUID mismatch → Dedup fails
- Tab name not exact match → Duplication
- Delete state not preserved → Merge issue

## File Locations

```
tests/
├── README.md                     # How to run tests
├── TEST_SUMMARY.md              # Summary of all tests
├── COMPLETE_TEST_DOCUMENTATION.md # Full documentation
├── run-tests.js                 # Main test runner
├── run-sync-tests.js            # Sync scenario runner
├── task-operations.test.js      # Task tests
├── tab-management.test.js       # Tab tests
├── sync-merge.test.js           # Sync tests
├── persistence.test.js          # Storage tests
└── test-sync-scenarios.js       # Sync state manager
```

## Why These Tests Matter

✅ **Catch bugs early** - Before browser testing  
✅ **Prevent regressions** - When refactoring code  
✅ **Verify sync logic** - Multi-device reliability  
✅ **Ensure data integrity** - No task loss  
✅ **Test edge cases** - Conflicts, deletes, rapid operations  

## Next: Browser Testing

After tests pass, manually verify in:
- [ ] iOS PWA (iPhone/iPad)
- [ ] Chrome Desktop
- [ ] Firefox Desktop
- [ ] Safari Desktop/Mobile
- [ ] Real Google Drive sync

## Success Criteria

✅ All 59 tests pass  
✅ 100% success rate  
✅ No error messages  
✅ All test categories covered  
✅ Multi-device scenarios working  

Ready to test in browser! 🚀
