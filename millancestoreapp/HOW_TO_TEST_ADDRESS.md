# How to Test Address Feature

## Quick Test Steps

### Step 1: Launch App
```bash
cd "C:\Users\Srimathi\OneDrive\Desktop\Millance\millancestoreapp"
flutter run
```

### Step 2: Check Initial Header
You should see:
- Orange gradient header
- White card with "Add Address" text in orange
- "Tap to add delivery address" subtitle
- Location icon (orange)
- Forward arrow (orange)

### Step 3: Tap "Add Address"
- Tap anywhere on the white location card
- "Add New Address" screen opens

### Step 4: Fill Address Form

**Contact Details:**
```
Name: John Doe
Phone: 9876543210
```

**Address Details:**
```
Pincode: 560001
Address: 123, Main Street, Apartment 4B
Locality: Santhinagar, Near Jairam Arts
City: Bangalore
State: Karnataka
```

**Address Type:**
- Tap "Home" (already selected by default)
- Or choose "Office" or "Other"

### Step 5: Save Address
- Scroll down
- Tap orange "Save Address" button
- See green success message: "Address saved successfully"
- Automatically returns to home screen

### Step 6: Verify Saved Address
You should now see:
- Home icon (🏠) instead of location icon
- "HOME" text (black, not orange)
- Your address: "123, Main Street, Apartment 4B, Santhinagar, Bangalore"
- Down arrow (▼) instead of forward arrow

### Step 7: Edit/Change Address
- Tap the location bar again
- Opens "Add New Address" screen
- Fill new address or edit existing
- Save again

## Expected Behavior

✅ **Before Adding Address:**
- Orange "Add Address" text
- Location icon in orange
- Forward arrow pointing right
- Subtitle prompts user to add address

✅ **After Adding Address:**
- Black "HOME" text
- Home icon in black
- Address line showing your saved address
- Down arrow indicating dropdown/change option

✅ **Form Validation:**
- All fields are required
- Phone must be 10 digits
- Pincode must be 6 digits
- Shows error messages if validation fails

✅ **Navigation:**
- Smooth transition to Add Address screen
- Returns to home screen after save
- Address updates immediately in header

## Test Different Scenarios

### Scenario 1: Incomplete Form
1. Fill only Name and Phone
2. Try to save
3. Should show error: "Please enter pincode"

### Scenario 2: Invalid Phone
1. Enter phone: 123 (only 3 digits)
2. Try to save
3. Should show: "Please enter valid 10-digit number"

### Scenario 3: Invalid Pincode
1. Enter pincode: 123 (only 3 digits)
2. Try to save
3. Should show: "Please enter valid 6-digit pincode"

### Scenario 4: Complete Valid Form
1. Fill all fields correctly
2. Tap "Save Address"
3. Should show success message
4. Header updates with your address
5. Icon changes from location to home

### Scenario 5: Different Address Types
1. Try saving as "Home" - see home icon style
2. Try saving as "Office" - see work icon style
3. Try saving as "Other" - see location icon style

## Visual Guide

```
┌─────────────────────────────────────────────────────────┐
│  BEFORE ADDING ADDRESS                                   │
│  ┌────────────────────────────┐  ┌────────────┐        │
│  │ 🗺️ Add Address          → │  │ ⚡ 0       │        │
│  │   Tap to add delivery...   │  └────────────┘        │
│  └────────────────────────────┘                         │
└─────────────────────────────────────────────────────────┘
                         ↓ [Tap]
┌─────────────────────────────────────────────────────────┐
│  ADD NEW ADDRESS SCREEN                                  │
│                                                          │
│  Contact Details                                         │
│  ┌────────────────────────────────────┐                │
│  │ Name: ___________________________  │                │
│  │ Phone: __________________________  │                │
│  └────────────────────────────────────┘                │
│                                                          │
│  Address Details                                         │
│  ┌────────────────────────────────────┐                │
│  │ Pincode: ________________________  │                │
│  │ Address: ________________________  │                │
│  │          ________________________  │                │
│  │ Locality: _______________________  │                │
│  │ City: ______ State: _____________  │                │
│  └────────────────────────────────────┘                │
│                                                          │
│  Save Address As                                         │
│  [🏠 Home] [💼 Office] [📍 Other]                      │
│                                                          │
│  ┌────────────────────────────────────┐                │
│  │     [SAVE ADDRESS BUTTON]          │                │
│  └────────────────────────────────────┘                │
└─────────────────────────────────────────────────────────┘
                         ↓ [Save]
┌─────────────────────────────────────────────────────────┐
│  AFTER ADDING ADDRESS                                    │
│  ┌────────────────────────────┐  ┌────────────┐        │
│  │ 🏠 HOME                  ▼ │  │ ⚡ 0       │        │
│  │   123, Main Street, Sa...  │  └────────────┘        │
│  └────────────────────────────┘                         │
└─────────────────────────────────────────────────────────┘
```

## Common Issues & Solutions

### Issue: Address not updating in header
**Solution:** Make sure you filled all required fields before saving

### Issue: Can't tap location bar
**Solution:** Check if you're tapping on the white card area

### Issue: Validation errors
**Solution:** 
- Phone: Exactly 10 digits (no spaces or hyphens)
- Pincode: Exactly 6 digits
- All fields must be filled

### Issue: Address too long in header
**Solution:** This is expected - address gets truncated with "..." automatically

## Success Indicators

✅ Location icon changes to home icon
✅ "Add Address" text changes to "HOME"
✅ Orange color changes to black
✅ Forward arrow changes to down arrow
✅ Your address appears below "HOME"
✅ Green success message appears
✅ Smooth navigation back to home screen

Perfect! Your address feature is working correctly! 🎉
