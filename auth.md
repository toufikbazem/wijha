Implement the following enhancements for the Job Management (Admin Dashboard):

1. Job Status Reason Handling
   When the admin updates a job post status to:
   "Pending" or "Rejected"
   A required input field (modal or form) must appear to enter a reason.
   This reason should be:
   Stored in the database field: status_reason
   Updated every time the status changes to one of these values
   Ensure:
   Validation: reason cannot be empty
   UI feedback (error message if empty)
   Display:
   Add a tooltip or info icon in the job table to show status_reason when status is "pending" or "suspended"

2. Admin Job Post Creation

Add a "Create Job Post" feature in the admin dashboard:

a. Company Selection
Admin can:
Select an existing company (dropdown or search)
Or enable "Anonymous Company" option
d. Backend Handling
If employer exist: store employer_id and created_by(admin_id)
else if is_anonymouse store just created_by

explain implementation approach, do not write any code.
