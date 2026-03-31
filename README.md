# Resume Tracker

A full-stack application for managing and tracking resumes using Node.js, Express, Azure Cosmos DB, and Azure Blob Storage.

## Features

- **Candidate Upload**: Upload resumes with name, email, and skills
- **Secure Storage**: Files stored in Azure Blob Storage
- **Admin Dashboard**: View analytics and manage resumes
- **Search Functionality**: Filter resumes by skills
- **Dark Mode**: Toggle between light and dark themes
- **Delete Capability**: Remove resumes from the system
- **File Size Tracking**: Display resume sizes in KB

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: Azure Cosmos DB (NoSQL)
- **File Storage**: Azure Blob Storage
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Platform**: Azure Cloud

## Prerequisites

- Node.js (v18+)
- npm
- Azure Account
- Git

## Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd RESUME-TRACKER
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with your Azure credentials:
```env
COSMOS_CONNECTION_STRING=<your-connection-string>
BLOB_STORAGE_CONNECTION_STRING=<your-storage-connection-string>
PORT=3000
```

4. Start the application:
```bash
npm start
```

5. Open your browser and go to:
```
http://localhost:3000
```

## Project Structure

```
RESUME-TRACKER/
├── app.js                    # Server entry point
├── public/
│   ├── index.html           # Frontend page
│   ├── app.js               # Frontend logic
│   └── style.css            # Styling
├── src/
│   ├── routes/
│   │   └── resumes.js       # API routes
│   └── services/
│       ├── cosmosService.js # Database operations
│       └── blobService.js   # File storage operations
└── package.json             # Dependencies
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/resumes/upload` | Upload a new resume |
| GET | `/api/resumes/list` | Get all resumes |
| GET | `/api/resumes/search` | Search resumes by skills |
| DELETE | `/api/resumes/delete/:id` | Delete a resume |

## Usage

### For Candidates
1. Select "Candidate View" on login
2. Fill in your name, email, and skills
3. Upload your resume
4. View your resume details

### For Admins
1. Select "Admin Login" on login
2. View analytics dashboard
3. Search resumes by skills
4. Download or delete resumes as needed

## Features Overview

- **Upload**: POST multipart/form-data with file
- **List**: Retrieve all stored resumes
- **Search**: Filter by comma-separated skills
- **Delete**: Remove resume and associated file
- **Analytics**: View stats on uploads
- **Theme**: Toggle dark/light mode

## Environment Variables

Create a `.env` file with:

```
COSMOS_CONNECTION_STRING=<Your Cosmos DB Connection String>
BLOB_STORAGE_CONNECTION_STRING=<Your Blob Storage Connection String>
PORT=3000
```

## Running Locally

```bash
npm install
npm start
```

Server will start on `http://localhost:3000`

## Deployment

To deploy to Azure App Service:

1. Push code to GitHub
2. Create Azure App Service
3. Connect GitHub repository
4. Configure environment variables in Azure
5. Deploy

## License

MIT

## Support

For issues or questions, please check the error messages in the browser console.
