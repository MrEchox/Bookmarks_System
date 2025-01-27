# Bookmark System
### A simple bookmark saving system with dynamic number of workspaces and bookmarks.

## User guide:
1. When first opening the website you are greeted with a log-in page.
1.a. If you have an account, simply enter your credentials and press the "Login" button.
1.b. If you do not have an account, press on the "Register" link in the header, fill out the form and press "Register". Upon completion you may now log-in.
2. Upon logging in, you will be greeted by your workspace list where you can create a workspace. These will store all of the bookmarks.
3. To create a workspace, simply enter a name for the workspace and press "Create Workspace" button.
4. Now you can see your newly created workspace, you can open it to see the stored bookmarks or delete it.
5. Upon pressing "Open" on the workspace, you will see the bookmark manager tab. Here you can enter your URL for the bookmark, give it a name and a tag. URLs MUST start with either "http://" or "https://". Upon filling the information, press "Add Bookmark" and it will be added.
6. Saved bookmarks will show you the "Status" of the URL. It can be "Available" (accessible normally), "Redirecting" (leads somewhere else) or "Dead" (unaccessible). When the URLs have not been checked they will temporarily gain the "Checking" status.
7. From here you can edit, open and delete your bookmarks.
8. Editing a bookmark is straightforward: You press "Edit" near the bookmark and you will be given a form to change any of the existing values assigned to your bookmark.
9. If you wish to change your workspace, you can press "Workspaces" link in the header and you will be redirected back to your workspace list.
10. Once you want to sign-out of your account. You can simply press "Logout" button in the header.

## User stories:
- As a user, I want to have an account where I can store my personal bookmarks.
- As a user, I want to be able to register and log in and out of my account.
- As a user, I want to have multiple workspaces, where I can keep my bookmarks.
- As a user, I want to be able to create/delete workspaces.
- As a user, I want to add any number of bookmarks, give them a name, url and a tag.
- As a user, I want to be able to search for my bookmarks by tag, name or the url.
- As a user, I want to be able to edit my bookmarks, change the name, url and tag.
- As a user, I want to see which bookmarks are "available", "redirecting" or "dead".
- As a user, I want to be able to conveniently open my bookmarks.
- As a user, I want to to import and export my bookmarks via JSON file.

## Testing plan:
1. Overview
	- Objective: Ensure functionality and usability of the website.
	- Scope: Front-end built with React, back-end built with Django and database by SQLite.
	- What to test:
		- User authenticaiton and authorization (login, registration, logout)
		- Workspace CRUD operations
		- Bookmark CRUD operations
		- Bookmark status updates
		- API integration between frontend and backend

2. Testing environment
	- Frontend: React.js
	- Backend: Django
	- Database: SQLite
	- Tools: Postman, Browser DevTools, Jest, React Testing Lib
	- Browsers: Firefox, Opera, Chrome, Edge
	- Devices: Desktop, Mobile
	
3. Testing types
	- Functional:
		- Verify authentication/authorization operations
		- Test CRUD on workspaces table
		- Test CRUD on bookmarks table
		- Make sure correct bookmark status is displayed
		- Validate proper error handling
	- API:
		- Make sure all API endpoints are working as expected
		- Validate error handling
	- Integration:
		- Make sure interaction between front-end and back-end is seamless
		- Data is consistent between UI and database
	- Securty:
		- Make sure passwords are hashed
		- Test token expiration
		
4. (Few) Test scenarios:
	(Feature, Test case, expected result)
	- Login:
		- Enter valid credentials and log in - Successful log in.
		- Enter invalid credentials and log in - Error message is displayed.
		- Access protected routes w/o logging in - Redirect to login page.
	- Registration:
		- Enter valid credentials and register in - Successful registration.
		- Enter invalid credentials and register - Error message is displayed.
	- Workspace management:
		- Add new workspace - Workspace is added, accessible and empty.
		- Remvoe workspace - Workspace is removed from table and bookmarks associated too.
	- Bookmark management:
		- Add new bookmark - Bookmark is added, can be opened and status is shown.
		- Remove bookmark - Bookmark is removed from table.
		- Edit bookmark - Bookmark information is updated.
	- API:
		- Send GET request with valid token to '/api/workspace/' - API returns valid response (or 404 if none).
		- Send request without token to endpoint apart from auth - API returns invalid response.
		
## Architecture (Class diagram):
![Class diagram](https://cdn.discordapp.com/attachments/907214110301782046/1333158866912940032/image.png?ex=67988932&is=679737b2&hm=1b35b34d5e10d603214e6e0c08836e3270bec2032568acfb528b5686098acde6&)

## Projekto išvados (Summary in lithuanian):
- Pavyko realizuoti front-end ir back-end prototipus.
- Pavyko realizuoti iškeltus projekto reikalavimus sistemai:
    - Autentifikacija ir autorizacija;
    - URL žymių CRUD operacijas;
    - Darbo aplinkos (angl. workspace) perjunginėjimą;
    - URL žymių paiešką pagal pavadinimą, URL arba susieta žyma (angl. tag);
    - Žymų (angl. tag) kūrimą bei susiejimą su URL nuorodomis.
    - URL žymių būsenos atvaizdavimą;
- Pavyko sukurti ir sėkmingai saugoti įrašus į SQLite duombazę.
- Priėmiau sprendimą realizuoti žymas (angl. tag) kaip papildomą ir 'nullable' laukelį prie URL žymos objekto.
- Nepavyko realizuoti importavimo/eksportavimo iš JSON failų.
- Nepavyko realizuoti URL būsenų atvaizdavimų (greičiausiai dėl tinklo apsaugos nuostatų).
- Buvo užtrukta nemažai laiko suprasti SQLite ir Django.
- Ant projekto praleista ~ 20 val.

