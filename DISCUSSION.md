# Project Discussion

<<<<<<< HEAD
## Development Approach & Reflection

### Developer Experience & Code Quality Focus

When working on this assignment, I prioritized developer experience and code quality as core principles. My approach centered on two key questions:

1. **What are we trying to accomplish?** - Ensuring clear intent and purpose in every code change
2. **Would a new engineer be able to get up and running quickly?** - Focusing on onboarding ease and code comprehension

The goal was to create code that not only functions well but also makes sense to future team members who might inherit or contribute to this project.

### Git Workflow & Team Collaboration

I structured my development process around realistic team workflows, considering how development might function at Solace. All work was completed from a `develop` branch to simulate a proper git flow strategy that would support:

- Feature branch development
- Code review processes
- Production deployment workflows

### AI Tool Usage

I utilized AI assistance strategically throughout this project, primarily for:

- **Documentation**: Generating clear, comprehensive documentation and discussion notes
- **Git commit messages**: Creating consistent, descriptive commit messages following conventional standards
- **PR descriptions**: Crafting detailed pull request descriptions that explain changes and benefits
- **Code improvements**: Some code refactoring and optimization tasks

The majority of architectural decisions, design choices, and core development logic were driven by my own analysis and experience, with AI serving as a productivity tool for documentation and consistency.

## Database Tools

=======
>>>>>>> e0f055c (  refactor: extract data fetching logic with async/await and error)
### Adminer Database Viewer

Added Adminer to docker-compose.yml so dev team can easily view the PostgreSQL database in the browser.

**Access:** http://localhost:8080 after `docker compose up`

**Connection:**

- System: PostgreSQL
- Server: db
- Username: postgres
- Password: password
- Database: solaceassignment

### Code Quality Improvements

#### Refactored Filter Logic and State Management

Improved advocates search functionality by extracting filter logic and replacing DOM manipulation with React state.

**Changes:**

- Created `matchesSearchTerm` function for reusable filtering logic
- Added proper TypeScript types with `Advocate` interface
- Replaced `document.getElementById` with React state for search term display
- Fixed type issues with `yearsOfExperience` and `specialties` array filtering
- Renamed `onChange` to `handleFilteringAdvocates` for better code clarity

**Benefits:**

- Better code organization and reusability
- Improved type safety with TypeScript
- React best practices (no direct DOM manipulation)
- Case-insensitive search functionality
<<<<<<< HEAD
=======

#### Extracted Data Fetching Logic

Refactored API data fetching by extracting fetch logic from useEffect into a dedicated async function with proper error handling.

**Changes:**

- Created `fetchAvailableAdvocates` async function with try-catch error handling
- Replaced promise chains with modern async/await syntax
- Added response status validation with descriptive error messages
- Implemented proper error logging for debugging

**Benefits:**

- Better error handling and user feedback
- Modern JavaScript best practices
- Reusable fetch function for future needs
- Improved code readability and maintainability
>>>>>>> e0f055c (  refactor: extract data fetching logic with async/await and error)
