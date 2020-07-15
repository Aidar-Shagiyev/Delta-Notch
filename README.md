# Delta-Notch
Simulation of cell differentiation driven by Delta-Notch system using Javascript.

The simulation is available <a href="https://htmlpreview.github.io/?https://github.com/Aidar-Shagiyev/Delta-Notch/blob/master/delta_notch.html" target="_blank">here</a> (although for whatever reason it may appear broken; refreshing/resizing the window usually solves the problems). For authentic experience clone the repository and open the HTML file with a web browser of your choosing (I tested it in Chrome, but any browser should suffice).

## A little bit of Biology
One of the possible strategies to fine-tune differentition pattern is lateral inhibition —- a type of cell-cell interaction whereby a cell that adopts a particular fate inhibits its immediate neighbours from doing likewise (e.g. nascent neural cells inhibit their neighbours from becoming one).

One of the ways to achieve lateral inhibition is through Delta-Notch system: when Delta protein is present on the cell's surface, it interacts with Notch protein of a neighbouring cell starting a signaling cascade which, among other things, inhibits exposition of Delta protein. Thus, there is a positive feedback loop: more Delta on a cell --> more Notch signaling in a neighbour --> less Delta on the neighbour --> less Notch signaling in the cell --> more Delta on the cell. This results in an obvious pattern: lonely cells without active Notch signaling (and lots of Delta) surrounded by cells with active Notch signaling (and almost no Delta).

## Model
The model is completely yoinked from <a href="https://doi.org/10.1006/jtbi.1996.0233" target="_blank">this paper</a>.
