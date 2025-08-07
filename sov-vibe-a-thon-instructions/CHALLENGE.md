# 🎯 SOV Vibe-A-Thon Challenge Specification

## Challenge Overview
Build a comprehensive **Team Metrics** application in 90 minutes using AI-assisted development practices.

## Essential Features to Implement

### 🔐 User Authentication System
**Priority: HIGH** - Core security feature
- User registration with email/password
- Login functionality with session management
- Role-based access control:
  - **Admin**: Full system access
  - **Team Lead**: Team and member management
  - **User**: Personal accomplishments only
- Secure session handling (JWT or similar)

### 👥 User Management (Admin/Team Lead Only)
**Priority: HIGH** - Required for multi-user system
- Create and manage user accounts
- Assign users to teams and roles
- User profile management:
  - Contact details (email, name)
  - Department information
  - Role assignment
- User list with search and filtering

### 🎯 Accomplishment Tracking
**Priority: CRITICAL** - Core application feature
- **Create accomplishments** with:
  - Title (required)
  - Detailed description
  - Type categorization: Project, Goal, KPI
  - Completion dates
  - Tags for organization
  - Metrics/measurements
- **Personal accomplishment dashboard**
- **Filter and search capabilities**:
  - By type (Project, Goal, KPI)
  - By date range
  - By tags
  - Text search in title/description
- **Edit and delete** accomplishments
- **View accomplishment details**

### 🏢 Team Management
**Priority: HIGH** - Team collaboration feature
- Create and manage teams
- Assign team members and roles
- Team-level accomplishment aggregation
- Team performance overview
- Team member list and management

### 📊 Reporting & Analytics
**Priority: MEDIUM** - Value-add feature
- Generate monthly team reports
- Export reports as PDF
- Dashboard with visualizations:
  - Accomplishments by type (doughnut chart)
  - Progress over time (line chart)
  - Team statistics and metrics
- Performance analytics

## Technical Requirements

### Foundational Architecture
- **Clean separation** between presentation, business logic, and data layers
- **Responsive web application** accessible on desktop and mobile
- **Persistent data storage** (local JSON files or database)
- **Proper authentication and authorization** mechanisms
- **Interactive user interface** with real-time updates
- **Web development best practices** and accessibility guidelines

### Recommended Technology Stack
While you can use any technology, the starter project includes:
- **Frontend**: React 18+ with React Router
- **Backend**: Node.js with Express
- **Database**: MongoDB or JSON file storage
- **Authentication**: JWT tokens
- **Charts**: Chart.js for data visualization
- **Styling**: CSS with utility classes provided

## Success Criteria

### Functional Implementation (40 points)
- Core features work as demonstrated
- User workflows are complete and functional
- Application handles edge cases gracefully
- Features integrate well together

### AI Toolchain Effectiveness (30 points)
- Evidence of effective AI assistant usage
- Quality of prompt engineering
- Documentation of AI-assisted development process
- Efficient problem-solving with AI guidance

### Code Quality & Structure (20 points)
- Clean, readable code organization
- Proper separation of concerns
- Error handling and validation
- Comments and documentation

### Demo & Documentation (10 points)
- Clear demonstration of working features
- Comprehensive setup instructions
- AI usage documentation
- Lessons learned summary

## Development Priorities

### Phase 1 (First 30 minutes)
1. Set up authentication system
2. Create basic user registration/login
3. Implement user roles

### Phase 2 (Next 30 minutes)
1. Build accomplishment tracking
2. Create accomplishment forms
3. Implement accomplishment list/filtering

### Phase 3 (Final 30 minutes)
1. Add team management
2. Build basic reporting
3. Polish UI and fix bugs

## Time Management Tips

- **Focus on core functionality** over perfect design
- **Use AI assistance effectively** - ask specific questions
- **Test frequently** - make sure features work as you build
- **Document as you go** - capture AI usage patterns
- **Prioritize working features** over comprehensive features

## AI Assistant Usage

Your AI assistant (Cline) has comprehensive context about:
- Complete challenge requirements
- Evaluation criteria
- Technical implementation patterns
- Best practices for rapid development
- Common pitfalls to avoid

**Effective AI prompts:**
- "Help me implement JWT authentication for this login form"
- "Create a React component for accomplishment filtering"
- "Build an API endpoint for team management with proper validation"
- "How should I structure the database for accomplishments and teams?"

## Submission Requirements

### Immediate (End of 90 minutes)
- **Complete project zip file**
- **README.md** with setup instructions
- **Working application** that runs locally
- **AI-NOTES.md** documenting AI assistance used

### Follow-up (By Monday)
- **5-minute demo video** showing key features
- **Best practices document** with lessons learned
- **Sample prompts** that worked effectively

## Evaluation Focus

Remember: This is about exploring AI-assisted development practices while building a functional application. The goal is to learn how to effectively collaborate with AI tools in a time-constrained environment.

**Key Questions:**
- How effectively did you use AI assistance?
- What development patterns worked best with AI?
- How did you manage the 90-minute time constraint?
- What would you do differently next time?

---

*Ready to start? Ask your AI assistant: "What should I build first for the Team Metrics application?"*
