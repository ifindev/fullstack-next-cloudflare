# Testing Guide

Manual testing checklist for the CRM application. Complete all tests before deployment.

---

## Setup

1. **Create a test user account**
   ```bash
   pnpm run dev
   # Visit http://localhost:3000/signup
   # Create account: test@example.com
   ```

2. **Seed the database** (optional, for demo data)
   ```bash
   # Update userId in src/lib/seed.ts first
   pnpm run db:seed
   ```

---

## Feature Tests

### Contacts Module

#### Create Contact

- [ ] **Create contact with all fields**
  - Navigate to `/dashboard/contacts/new`
  - Fill: firstName, lastName, email, phone, company, jobTitle, notes
  - Submit → Redirects to `/dashboard/contacts`
  - Verify contact appears in list

- [ ] **Create contact with minimal info**
  - Navigate to `/dashboard/contacts/new`
  - Fill ONLY firstName
  - Submit → Should succeed (no validation errors)
  - Verify contact appears with firstName only

- [ ] **Validation: require at least one name**
  - Try to create contact with NO firstName and NO lastName
  - Should show error: "At least one name is required"

- [ ] **Validation: email format**
  - Enter invalid email: "notanemail"
  - Should show error: "Invalid email format"

#### Search Contacts

- [ ] **Search by first name**
  - Enter "Sarah" in search box
  - Verify only Sarah Johnson appears

- [ ] **Search by email**
  - Enter email address
  - Verify correct contact appears

- [ ] **Search by company (case-insensitive)**
  - Enter "techcorp" (lowercase)
  - Verify TechCorp contact appears

- [ ] **Clear search**
  - Clear search box
  - Verify all contacts reappear

#### Edit Contact

- [ ] **Edit existing contact**
  - Click contact card → Edit
  - Change email address
  - Submit → Redirects to list
  - Verify email updated

- [ ] **Ownership verification**
  - Attempt to edit another user's contact (if multi-user)
  - Should redirect or show error

#### Delete Contact

- [ ] **Delete contact**
  - Click contact card → Delete button
  - Confirm deletion in dialog
  - Verify contact removed from list

- [ ] **Delete contact with linked deal**
  - Delete contact that has deals
  - Verify deal's contactId set to null (deal still exists)
  - Verify deal shows "No contact" on deals page

#### Tags

- [ ] **Create tag**
  - Create tag: "Test Tag" with color "blue"
  - Verify tag appears in tag list

- [ ] **Assign tag to contact**
  - Assign "Customer" tag to contact
  - Verify tag badge appears on contact card

- [ ] **Assign multiple tags**
  - Assign 3 different tags to one contact
  - Verify all 3 badges appear

- [ ] **Remove tag from contact**
  - Remove tag assignment
  - Verify badge removed

- [ ] **Delete tag**
  - Delete a tag
  - Verify junction table cleaned up (no orphaned assignments)

---

### Deals Module

#### Create Deal

- [ ] **Create deal linked to contact**
  - Navigate to `/dashboard/deals/new`
  - Fill: title, select contact, value, currency, stage, expectedCloseDate, description
  - Submit → Redirects to `/dashboard/deals`
  - Verify deal appears in correct stage column

- [ ] **Create deal with no contact**
  - Leave contact dropdown as "No contact"
  - Fill other fields
  - Submit → Should succeed
  - Verify deal shows "No contact" on card

- [ ] **Currency formatting**
  - Create deal with value: 12345.67
  - Select currency: AUD
  - Verify displays as "$12,345.67" on card

#### Pipeline Board

- [ ] **View all 6 stage columns**
  - Navigate to `/dashboard/deals`
  - Verify columns: Prospecting, Qualification, Proposal, Negotiation, Closed Won, Closed Lost
  - Verify each column shows count

- [ ] **Pipeline value calculation**
  - Verify pipeline value excludes "Closed Won" and "Closed Lost" deals
  - Add values of active deals manually → Compare to displayed total

#### Edit Deal

- [ ] **Change deal stage**
  - Edit deal, change stage from "Prospecting" to "Qualification"
  - Submit → Verify deal moves to Qualification column

- [ ] **Change linked contact**
  - Edit deal, change contact from A to B
  - Submit → Verify contact name updates on card

- [ ] **Update expected close date**
  - Change expectedCloseDate
  - Verify date displays correctly formatted

#### Delete Deal

- [ ] **Delete deal**
  - Click deal card → Delete button
  - Confirm deletion
  - Verify deal removed from pipeline
  - Verify pipeline value updates

- [ ] **Ownership verification**
  - Attempt to edit/delete another user's deal (if multi-user)
  - Should redirect or show error

---

### Dashboard

#### Metrics Display

- [ ] **Metrics show correct counts**
  - Total Contacts: Count contacts in `/dashboard/contacts`
  - Active Deals: Count non-closed deals in pipeline
  - Pipeline Value: Sum active deal values
  - Verify dashboard metrics match manual count

- [ ] **New Contacts This Month**
  - Create new contact today
  - Verify "New Contacts This Month" increments
  - Verify "Total Contacts" card shows "+1 this month"

- [ ] **Deals Won This Month**
  - Create deal with stage "Closed Won" and updatedAt this month
  - Verify "Deals Won This Month" increments

- [ ] **Win Rate calculation**
  - Count total closed deals (Won + Lost)
  - Count Closed Won deals
  - Calculate: (Won / Total Closed) × 100
  - Verify dashboard win rate matches

#### Quick Actions

- [ ] **New Contact link**
  - Click "New Contact" card
  - Verify navigates to `/dashboard/contacts/new`

- [ ] **New Deal link**
  - Click "New Deal" card
  - Verify navigates to `/dashboard/deals/new`

- [ ] **View Pipeline link**
  - Click "View Pipeline" card
  - Verify navigates to `/dashboard/deals`

---

### Navigation

- [ ] **Navigation title**
  - Verify app title shows "CRM" (not "TodoApp")

- [ ] **Navigation links work**
  - Click "Home" → Navigates to `/`
  - Click "Contacts" → Navigates to `/dashboard/contacts`
  - Click "Deals" → Navigates to `/dashboard/deals`

- [ ] **Logout**
  - Click logout button
  - Verify redirects to `/login`
  - Verify session cleared

---

## Security Tests

### Authentication

- [ ] **Require auth for protected routes**
  - Log out
  - Attempt to visit `/dashboard`
  - Should redirect to `/login`

### Authorization

- [ ] **User data isolation** (requires 2+ users)
  - Create User A and User B
  - User A creates contacts/deals
  - Log in as User B
  - Verify User B cannot see User A's data

- [ ] **Cannot edit other user's data**
  - Attempt to access edit URL for another user's contact
  - Should redirect or show error

- [ ] **Cannot delete other user's data**
  - Attempt to delete another user's deal via form submission
  - Should fail with ownership check

---

## UI/UX Tests

### Forms

- [ ] **Form validation runs before submit**
  - Enter invalid email
  - Click submit
  - Verify error shown inline (not server error)

- [ ] **Required field indicators**
  - Check forms show required field markers

- [ ] **Success feedback**
  - Create contact
  - Verify success message/toast appears (if implemented)

### Responsive Design

- [ ] **Mobile layout (375px width)**
  - Open DevTools, set viewport to 375px
  - Verify navigation collapses/adapts
  - Verify metrics grid shows 1 column
  - Verify pipeline columns stack vertically
  - Verify forms are usable

- [ ] **Tablet layout (768px width)**
  - Set viewport to 768px
  - Verify metrics grid shows 2 columns
  - Verify navigation shows icons

- [ ] **Desktop layout (1440px width)**
  - Set viewport to 1440px
  - Verify metrics grid shows 3 columns
  - Verify pipeline shows all 6 columns side-by-side

### Browser Console

- [ ] **No console errors**
  - Open browser DevTools console
  - Navigate through all pages
  - Perform CRUD operations
  - Verify NO errors in console

- [ ] **No console warnings** (bonus)
  - Check for React warnings
  - Check for deprecation warnings

---

## Edge Cases

### Data Integrity

- [ ] **Delete contact with deals**
  - Contact deleted → Deal's contactId set to NULL (not CASCADE)
  - Deal still exists

- [ ] **Delete tag**
  - Tag deleted → Junction table entries removed (CASCADE)
  - Contacts still exist

- [ ] **Empty states**
  - New user with NO data
  - Verify dashboard shows 0 for all metrics
  - Verify contacts page shows empty state
  - Verify deals page shows empty state

### Currency & Formatting

- [ ] **Large numbers**
  - Create deal with value: 1,234,567.89
  - Verify displays as "$1,234,567.89"

- [ ] **Zero values**
  - Create deal with value: 0
  - Verify displays as "$0.00"

- [ ] **Different currencies**
  - Create deals in USD, EUR, GBP
  - Verify correct currency symbol/format

### Dates

- [ ] **Past dates**
  - Create deal with expectedCloseDate in past
  - Verify displays correctly

- [ ] **Future dates**
  - Create deal with expectedCloseDate far in future
  - Verify displays correctly

---

## Performance Tests (Optional)

- [ ] **Large dataset**
  - Create 100+ contacts
  - Verify list loads in <2 seconds
  - Verify search is responsive

- [ ] **Concurrent users** (if multi-user)
  - 2+ users create contacts simultaneously
  - Verify no data corruption

---

## Test Results

**Date tested**: ___________
**Tester**: ___________
**Environment**: ☐ Local Dev  ☐ Staging  ☐ Production

**Pass/Fail Summary**:
- Contacts: ___ / ___ passed
- Deals: ___ / ___ passed
- Dashboard: ___ / ___ passed
- Security: ___ / ___ passed
- UI/UX: ___ / ___ passed
- Edge Cases: ___ / ___ passed

**Overall**: ☐ PASS  ☐ FAIL

**Notes**:
```
[Add any issues found, bugs to fix, or improvements to make]
```
