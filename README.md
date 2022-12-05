# Autonomous Collaborative Multi-Robot-System
Public version of the LRS, implemented at the Chair of Materials Handling, Material Flow, Logistics of the TUM

 All project-related sub-folders and scripts are in the src directory. To navigate the project, read the following brief description. Also, consider the comments inside the scripts.
 
1.	index.js: Contains the backend. All processes are coordinated and executed there. To follow the backend step-by-step logic in the code, go to the ‘trigger’ Emitter (l. 197).
2.	computation.js: Contains the computation module that returns the task allocation.
3.	map.js: The layout of the fml test hall as a two-dimensional array.
4.	transformation.js: Contains the static transformations (currently only the Tugger Train transformations are active in the computation).
5.	odometry.js: Adds the option to convert the odometric data sent by the Tugger Train to static coordinates.
6.	app.js: Separated instance of the server-side GUI to run it standalone.
7.	(Folder) public: Contains static data for the Webserver and images. 
    - client.js: the client-side JavaScript code for the selection pages.
    - 	style.css: Stylesheet for the GUI.
8.	(Folder) routes: Routes for rendering the pages are saved here.
9.	(Folder) views: 
    -	(Folder) home: The EJS Webpages.
10.	2022-10-19-15-17-37.bag: rosbag file that is used for testing or simulation purposes.


## Installation and Execution
General Installation Steps
First, a ROS distribution, Node.js, and NPM (Node Package Manager) must be installed. Then,
1.	Clone the repository.
2.	Run `npm install` in the project folder.

### Execution
There are two different ways of running the project:
1.	Node.js: open a terminal, go to the root folder of the project, and enter 
`npm start`.
2.	ROS Node: For execution as a ROS Node, the repository must be cloned into the source folder of the catkin workspace on the executing computer. Then, access the root directory of your catkin workspace and run `catkin build`. Now, the project should be executable using the `rosrun logistic-robot-system index.js` command.

### Execution with Both Robots
1.	Verify that the repository is installed on the Tugger Train.
2.	For communication with the iw.hub robot, add the API-key, the key-id, as well as all task IDs in the corresponding fields in the `sendToCloud()` method. If access to the AnyFleet API is not possible, one can still execute the code by disabling the `sendToCloud()` method as described in Execution on a local system.
3.	Update Transformation if necessary: Recalibrate the parameters and verify the calculation steps.
4.	Check that the Tugger Train publishes its odometric information in the /odom topic.
5.	Run the project.
6.	Open a browser and go to ‘http://localhost:8080’. 

### Execution on a Local System
Keep in mind that this project is designed for two mobile robots and even though it is possible to execute it on other ROS systems, full functionality is not guaranteed. However, it is possible to simulate such an environment by running the rosbag file (.bag) in the project root folder. This simulates the Tugger Train communication by publishing recorded Tugger Train data on ROS topics. However, modifications must be made to avoid errors.
1.	Empty the `sendToCloud()` by, e.g. putting comments around the HTTP-Request.
2.	Start the roscore.
3.	Run the project.
4.	Run the .bag file with `rosbag play <filename>`.
5.	Open a browser and go to ‘http://localhost:8080’. 

### Execution of the GUI
1.	Run `node src/app` within the project directory.
2.	Open a browser and go to ‘http://localhost:8080’.

## Common Errors
In the event of the error, `rosnodejs.require(..) is not a function` or a similar  rosnodejs-related error message: 
1.	Delete the node_modules folder from the project and do not run `npm install` in the project folder again.
2.	Enter the root directory, and there install all Node packages globally. 
    The `package.json file` includes the names of all required Node modules. 
    Run `npm install -g <package name>` for each Node module.
3.	This is a very annoying error; unfortunately, we do not know the cause of it. If this approach does not work, keep trying by deleting and reinstalling the project. 


