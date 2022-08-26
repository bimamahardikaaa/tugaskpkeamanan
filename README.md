How To set up

Please install node js and npm with this link:
https://nodejs.org/en/download/

the development is using node js version 14.20.0 but any node higher should work just fine

Please set up your postgresql following this link:
https://www.postgresql.org/download/

after installing and configuring complete create .env file to set up prisma as our orm
add following line into .env file:
DATABASE_URL="postgresql://POSTGRES_USERNAME:POSTGRES_PASSWORD@localhost:5432/univ?schema=public"

after that run
source .env

this will add our .env to environment variable so prisma can easily connect to your local database 

after all the above task is complete then go to student_univ_be and run 
npm install

this command will install every dependency for this project

after that you need to migrate prisma using :
npx prisma migrate dev 
it will create and update table in postgresql

after all of this complete you should be able to run local server with:
npm start