# Planes Over Vermont

Planes Over Vermont is a simple interface and dashboard application for viewing and monitoring planes flying over Vermont. Here are the abstract components of the project:

1. A navigatable map for viewing airplanes at their current locations (Leaflet)
2. An overlayed UI for navigation and data display (React)
3. a favorites list of planes
4. leave annotative notes for planes

## GOALS

### UI

#### Plane Tracker Sidebar

#### Selected Plane Data Display Window

### Map

- [ x ] Add the leaflet map
- [ x ] Set zoom and map position to Vermont
- [ x ] Retrieve open sky plane data
- [ x ] map plane location
- [ x ] angle plane towards the direction it's moving
- [ x ] create popup window with plane data when a plane is clicked
- [ ] create UI elements for the user to change how often (in seconds) the map is updated
- [ ] create favorites list to quickly be able to select certain planes
- [ ] create option on the plane data pop up for users to add notes
- [ ] restrict use of the leaflet map so when the user clicks on a plane it zooms into that and tracks it, but if the user deselects the map should default to the view of Vermont without drag/zoomability

## KNOWN BUGS
- [ ] Plane data popup doesn't go away when plane is deselected
- [ x ] Some planes on the map are outside of Vermont
