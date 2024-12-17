# Planes Over Vermont

Planes Over Vermont is a simple interface and dashboard application for viewing and monitoring planes flying over Vermont. Here are the abstract components of the project:

1. A navigatable map for viewing airplanes at their current locations (Leaflet)
2. An overlayed UI for navigation and data display (React)
3. a favorites list of planes
~~4. leave annotative notes for planes~~
4. a panel with live details of the currently selected planes

## GOALS

- [ x ] Add the leaflet map
- [ x ] Set zoom and map position to Vermont
- [ x ] Retrieve open sky plane data
- [ x ] map plane location
- [ x ] angle plane towards the direction it's moving
- [ x ] create popup window with plane data when a plane is clicked
- [ x ] create favorites list to quickly be able to select certain planes
- [ x ] restrict use of the leaflet map so when the user clicks on a plane it zooms into that and tracks it, but if the user deselects the map should default to the view of Vermont without drag/zoomability
- [ x ] Add/remove flights from the pinned flights list
- [ x ] populate plane data in a dropdown accordion for easy detailed viewing of flight info
- [ x ] Tidy up pinned flight details so there's less content overflow
-  [ x ] Tidy up pinned flight details cosmetically to improve labels, visual appeal, aesthetics and make the data more informed 
- [ x ] Replace pin icon with a better one on the flight details popup
- [ x ] Properly style both buttons on top of the flight details popup
- [ x ] Add a button option on the pinned flights to optionally pan the map over to the selected plane
- [ x ] create option on the plane data pop up for users to add notes
- [ x ] plane should be deselected if it flys out of range
- [ x ] create proper boundaries for Vermont with the planes
- [ x ] Error Handling for failing to reach the API

## STRETCH GOALS

~~- [ ] create UI elements for the user to change how often (in seconds) the map is updated~~
- [ x ] update plane location on map based on direction and velocity until the next update happens

## KNOWN BUGS
- [ x ] Plane data popup doesn't go away when plane is deselected
- [ x ] Some planes on the map are outside of Vermont
