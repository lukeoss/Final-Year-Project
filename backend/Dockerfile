# Use the specified Python image
FROM python:3.10.11

# Set the working directory in the container
WORKDIR /app

# Install any needed packages specified in requirements.txt
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy the current directory contents into the container at /app
COPY . /app

# Make port 8000 available to the world outside this container
EXPOSE 8000

# Run the Django app
CMD ["gunicorn", "--workers", "3", "--bind", "0.0.0.0:8000", "django_hstat.wsgi:application"]