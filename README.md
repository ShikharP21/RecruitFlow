#RecruitFlow
A comprehensive candidate filtering and selection platform designed to help recruiters build diverse teams of 5 candidates. Built with Next.js 15, TypeScript, Tailwind CSS, and Shadcn/UI.

## 🎯 Problem Statement

Create a full-stack application to help recruiters figure out who to hire. The platform enables users to:
- Filter through a large dataset of candidate submissions
- Select a diverse team of 5 people to hire
- Communicate why they were chosen through detailed reports
- Export team data for stakeholder presentations

## 🚀 Core Features

### 🎯 **Smart Candidate Filtering**
- **Multi-criteria Filters**: Skills, work availability, location, role name, company, education level, degree subject
- **Salary Range Filtering**: Dynamic salary range with real-time updates
- **Advanced Sorting**: Match score, date applied, salary, name, location, education, experience, top schools
- **Real-time Search**: Instant filtering with debounced input handling

### 👥 **Team Building & Analytics**
- **5-Candidate Selection**: Maximum team size with intelligent validation
- **Real-time Team Analytics**: Average salary, experience, geographic diversity, top school graduates
- **Skills Distribution**: Top skills analysis across the selected team
- **Match Score Tracking**: Rule-based scoring when filters are applied

### 📊 **Comprehensive Reporting**
- **Team Selection Modal**: Automatic modal when 5 candidates are selected
- **Email Export**: Pre-filled email client with complete team report
- **PDF Download**: Comprehensive hiring report with all candidate details
- **Professional Formatting**: Clean, shareable reports for stakeholders

### 🎨 **Enhanced User Experience**
- **Responsive Design**: Beautiful dark theme with smooth animations
- **Interactive Cards**: Expandable candidate cards with hover effects
- **Visual Icons**: Location pins, user icons, and intuitive UI elements
- **Smart Notifications**: Toast notifications for all user actions
- **Loading States**: Shimmer skeletons and loading indicators

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/UI
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Icons**: Lucide React
- **Email Integration**: Mailto protocol
- **File Export**: Blob-based PDF simulation

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd hirewise
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Project Structure

```
hirewise/
├── app/
│   ├── api/candidates/route.ts    # API endpoint for candidate data
│   ├── globals.css               # Global styles and theme
│   ├── layout.tsx                # Root layout with Inter font
│   ├── loading.tsx               # Loading skeleton component
│   └── page.tsx                  # Main application page
├── components/
│   ├── dashboard/
│   │   ├── CandidateCard.tsx     # Individual candidate display
│   │   ├── CandidateGrid.tsx     # Paginated candidate list
│   │   ├── FilterPanel.tsx       # Filter controls
│   │   ├── ShortlistPanel.tsx    # Selected candidates panel
│   │   ├── TeamAnalytics.tsx     # Team statistics
│   │   └── TeamSelectionModal.tsx # Team export modal
│   ├── layout/
│   │   └── Header.tsx            # Application header with export
│   ├── skeletons/                # Loading skeleton components
│   └── ui/                       # Shadcn/UI components
├── lib/
│   ├── store.ts                  # Zustand state management
│   ├── types.ts                  # TypeScript interfaces
│   ├── toast.tsx                 # Toast notification system
│   └── utils.ts                  # Utility functions
└── public/
    └── form-submissions.json     # Sample candidate data
```

## 🎨 Design System

### Color Palette (Dark Theme)
- **Background**: #0D1117 (Near-black)
- **Foreground**: #E6EDF3 (Off-white for text)
- **Card**: #161B22 (Dark grey)
- **Primary**: #3FB950 (Vibrant green)
- **Border**: #30363D (Subtle grey)
- **Muted**: #8B949E (Dimmer grey)

### Typography
- **Font**: Inter (Google Fonts)
- **Weights**: 400, 500, 600, 700

## 🔧 API Endpoints

### GET /api/candidates

Fetches and filters candidate data with computed properties and match scoring.

**Query Parameters:**
- `skills` (string): Comma-separated skills to filter by
- `workAvailability` (string): Comma-separated availability options
- `location` (string): Location filter
- `roleName` (string): Role name filter
- `company` (string): Company filter
- `educationLevel` (string): Education level filter
- `degreeSubject` (string): Degree subject filter
- `minSalary` (number): Minimum salary expectation
- `maxSalary` (number): Maximum salary expectation
- `sortBy` (string): Sort field (matchScore, date, salary, name, location, education, experience, topSchools)
- `page` (number): Page number for pagination
- `limit` (number): Number of results per page

**Response:**
```json
{
  "candidates": [...],
  "hasMore": boolean,
  "total": number,
  "page": number,
  "limit": number
}
```

## 🧮 Match Scoring Algorithm

The match score is calculated based on applied filters using a weighted rule-based system:
- **Skills Match (30%)**: Percentage of required skills found in candidate's skillset
- **Work Availability (20%)**: Match with desired work schedule
- **Location Match (15%)**: Geographic proximity or location match
- **Role Name Match (15%)**: Previous role experience relevance
- **Company Match (10%)**: Previous company experience relevance
- **Education Level (5%)**: Educational qualification match
- **Degree Subject (5%)**: Academic background relevance

## 🎯 Complete Workflow

### 1. **Candidate Discovery**
- Browse through paginated candidate list
- Use advanced filters to narrow down candidates
- View detailed candidate information with expandable cards
- See real-time match scores when filters are applied

### 2. **Team Building**
- Add candidates to shortlist (maximum 5)
- View real-time team analytics as you build
- See geographic diversity, salary ranges, and skill distribution
- Remove candidates with one-click functionality

### 3. **Team Completion**
- Automatic modal opens when 5 candidates are selected
- Review your complete hiring team
- Export team data via email or PDF download
- Share professional reports with stakeholders

### 4. **Export Options**
- **Email Export**: Opens default email client with pre-filled team report
- **PDF Download**: Comprehensive text report with all candidate details
- **Professional Formatting**: Ready-to-share reports for presentations

## 🎨 Key UI Components

### Header
- Full-width design with logo and export button
- Smart export button (enabled only when 5 candidates selected)
- Professional branding and navigation

### Filter Panel
- Comprehensive filtering options
- Real-time filter application
- Sort options with multiple criteria
- Clear filters functionality

### Candidate Grid
- Paginated display with loading states
- Expandable candidate cards with hover effects
- Visual icons for location, work availability, and user info
- Add/remove from shortlist functionality

### Shortlist Panel
- Real-time team analytics
- Individual candidate management
- Visual indicators for team completion
- Clear all functionality

### Team Selection Modal
- Automatic opening when team is complete
- Email export with pre-filled content
- PDF download with comprehensive report
- Professional success messaging

## 🚀 Deployment

The application is ready for deployment on Vercel, Netlify, or any other Next.js-compatible platform.

```bash
npm run build
npm start
```

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

Built with ❤️ using Next.js 15 and modern web technologies. Designed to revolutionize the hiring process with AI-powered candidate selection and team building.
