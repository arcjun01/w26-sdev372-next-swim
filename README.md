Swim App

1. Project Overview

    Name: NextSwim

    Tagline: Your next step in the water.

    Problem Statement: 

        Supports individuals as they improve their swimming by performing an accurate swim level analysis done through a quiz. Helps them achieve their aquatic goals by providing fitness exercises (on land and in water) based on the given swim level and sharing resources. Alleviates fear and anxiety surrounding water activities with education.


    Target Users:

        Swimmers of all levels.


2. Feature Breakdown

    MVP Features: 

        Swim level quiz, aquatic resources, set a goal


    Extended Features: 

        Recommended activities based on user's swim level, find nearby aquatic locations/events, timer, posting to other users


3. Data Model Planning

    Core Entities: 

        User information- ID, account info, level, goals
        Aquatic resources- resource ID, resource type, category, title  


    Key Relationships: 

        Users can access multiple resources (one to many)
        Aquatic resources can be recommended based on the user's level 
        Multiple users can access multiple resources (many to many)
        A user can have multiple goals (one to many)


4. User Experience

    User Flows:

        After logging into their account, the user will take a quiz to assign them with a swim level. They can set a goal for themselves that they can view under their account details. They can access aquatic resources for their own use, helping them achieve their goals.


    Wireframes/Sketches:

        Wireframe: 
            https://wireframe.cc/3jeA9w 



    Next Features to work on:

        * Swim quiz form 
        * Swim skill evaluation