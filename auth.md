You are working on an existing web application (React + Node.js/Express). Implement the following updates related to Profile Access → Search Profile and Profile View UI.

1. Search Profile:

Update the backend and/or frontend of search profile logic so that:

Only display profiles that have ALL of the following fields filled:
professional_title
experience_level
education_level
gender
Any profile missing one or more of these fields should be excluded from search results.

2. CV Badge Indicator

In the search results UI:

If a profile does NOT have a CV:
Display a badge labeled: "No CV"
If the profile has a CV:
Do not show the badge (or optionally show "CV Available" if consistent with UI)

Make sure the badge:

Is visually distinct (e.g., small tag, warning/neutral color)
Does not break the existing card layout

3. Profile View Page Fixes

When opening a profile (View Profile page):

Fix any existing UI issues such as:
Misaligned elements
Broken spacing or layout
Overflow issues
Inconsistent typography or styling
Ensure responsiveness across screen sizes
Ensure missing optional data does not break the layout.
you can use profile view from jobseeker module

4. Adaptation to Recent Data Model Changes

We recently updated the data model:

Profiles can now exist without a user account
Ensure search and view logic supports profiles without linked users
Replace:
experience_years → experience_level
Add support for:
education_level

Make sure:

All queries, filters, and UI components use the updated fields
No legacy references to experience_years remain

Before making any changes, analyze the existing website structure, and clearly explain the approach you will follow step by step.
do not write any code.
