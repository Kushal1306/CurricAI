# AI Curriculum Generator

This project is a web application that generates AI curricula based on user input. It utilizes Next.js for the frontend and Express.js for the backend.

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-name>
   ```

2. Install dependencies for both client and server:
   ```bash
   cd client
   npm install
   cd ../server
   npm install
   ```

### Running the Application

1. Start the server:
   ```bash
   cd server
   npm run dev
   ```

2. In a new terminal, start the client:
   ```bash
   cd client
   npm run dev
   ```

3. Open your browser and navigate to [http://localhost:5000](http://localhost:5000) to view the application.

## Features

- Generate AI curricula based on user-defined topics.
- View and download the generated curriculum as a PDF.
- Interactive UI with collapsible sections for video content.

## Technologies Used

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Express.js, OpenAI API, Google APIs
- **Database**: Not applicable (currently using in-memory data)

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.