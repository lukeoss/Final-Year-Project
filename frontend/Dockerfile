FROM node:20.10.0

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

# Install dependencies
RUN npm install

# Copy code
COPY . ./

CMD ["npm", "start", "build"] 
