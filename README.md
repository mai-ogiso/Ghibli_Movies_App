# Ghibli Movies App

Do you love Ghibli movies?  
In this app, you can compare the English version with the original (Japanese) one.

[Ghibli_Movie_Short.webm](https://user-images.githubusercontent.com/95740190/202062532-6c75efde-77f1-4852-9ce0-969f099329d7.webm)


## How It's Made:

**Tech used:** HTML, CSS, vanilla JavaScript, and Node.js (for implementing the serverless function on Netlify).

## Optimizations

For those who are big fans of Ghibli movies and want to learn English or Japanese, this app could be a great tool for language learning.
  
Example:  
- "spirit away" in English --> "神隠し" (Kamikakushi) in Japanese  
- "princess" in English --> "姫" (hime) in Japanese  

When I improve this app, I would add a dictionary function that can compare/translate English with Japanese.
  
## Lessons Learned:

1. While creating this app, I learned about Object-Oriented Programming (OOP) and asynchronous programming concepts such as async/await and promises.

2. I developed this app using the OOP concept, with a focus on encapsulation to create separate English and Japanese versions of the object. In case there is a need to add new movie items to this app, the code can be easily modified.

3. After completing the development of this app, I deployed it on Netlify and gained experience in using serverless functions.


## System Architecture:

1. To maintain the security of my API key, I stored it on Netlify, making it hidden and secure.

2. I used a serverless function on Netlify to retrieve the API key, ensuring a secure and seamless integration.  

![System_Diagram](https://user-images.githubusercontent.com/95740190/202063410-07ce9ca2-eec8-4625-acf3-7fb7d82548f4.png)
