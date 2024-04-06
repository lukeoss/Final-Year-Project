# Use an official Node runtime as a parent image
FROM node:14-alpine

# Set the working directory in the container
WORKDIR /app

# Install app dependencies
COPY package*.json /app/
RUN npm install

# Bundle app source
COPY . /app

# Build the app
RUN npm run build

# Install serve and serve the build directory
RUN npm install -g serve
CMD ["serve", "-s", "build", "-l", "5000"]

# Make port 5000 available to the world outside this container
EXPOSE 5000