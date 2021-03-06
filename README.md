# Delta-Notch
Simulation of cell differentiation driven by Delta-Notch system using Javascript.

The simulation is available <a href="https://htmlpreview.github.io/?https://github.com/Aidar-Shagiyev/Delta-Notch/blob/master/delta_notch.html" target="_blank">here</a> (although for whatever reason it may appear broken; refreshing/resizing the window usually solves the problems). For authentic experience clone the repository and open the HTML file with a web browser of your choosing (I tested it in Chrome, but any browser should suffice).

## A little bit of Biology
One of the possible strategies to fine-tune differentition pattern is lateral inhibition —- a type of cell-cell interaction whereby a cell that adopts a particular fate inhibits its immediate neighbours from doing likewise (e.g. nascent neural cells inhibit their neighbours from becoming one).

One of the ways to achieve lateral inhibition is through Delta-Notch system: when Delta protein is present on the cell's surface, it interacts with Notch protein of a neighbouring cell starting a signaling cascade which, among other things, inhibits exposition of Delta protein. Thus, there is a positive feedback loop: more Delta on a cell --> more Notch signaling in a neighbour --> less Delta on the neighbour --> less Notch signaling in the cell --> more Delta on the cell. This results in the following pattern: lonely cells without active Notch signaling (and lots of Delta) surrounded by cells with active Notch signaling (and almost no Delta).

## The Model
The model is completely yoinked from <a href="https://doi.org/10.1006/jtbi.1996.0233" target="_blank">this paper</a>.

Each cell has two parameters: <img src="https://latex.codecogs.com/svg.latex?\large&space;d">, which represents how many Delta molecules are available on the cell's surface for neighbours to see, and <img src="https://latex.codecogs.com/svg.latex?\large&space;n">, which represents strength of Notch signaling (and thus strength of inhibition of Delta). Their values lie in the range from 0 to 1, where 0 coresponds to total lack of Delta molecules on the surface/Notch signaling and 1 corresponds to the maximum possible number of Delta molecules/strength of Notch signaling (which are dictated by degradation speed). To describe the behavior of these parameters, the authors derived the following equations:

<img src="https://latex.codecogs.com/svg.latex?\large&space;\dot{n}=f(\bar{d})-n">
<img src="https://latex.codecogs.com/svg.latex?\large&space;\dot{d}=v*(g(n)-d)">

where <img src="https://latex.codecogs.com/svg.latex?\large&space;\bar{d}"> is the average <img src="https://latex.codecogs.com/svg.latex?\large&space;d"> of the neighbours, <img src="https://latex.codecogs.com/svg.latex?\large&space;v"> is the ratio of degradation speeds of Delta and Notch, <img src="https://latex.codecogs.com/svg.latex?\large&space;f"> is a continuous increasing function which represents uplift in Notch production in response to neighbours' Delta molecules, and <img src="https://latex.codecogs.com/svg.latex?\large&space;g"> is a continuous decreasing function which represents drop in Delta exposition in response to rising levels of Notch signaling. The authors used the following functions:

<img src="https://latex.codecogs.com/svg.latex?\large&space;f(x)=\frac{x^{k}}{a%2Bx^{k}}">
<img src="https://latex.codecogs.com/svg.latex?\large&space;g(x)=\frac{1}{1%2Bbx^{k}}">

I used the same values for free parameters as reported in the paper: <img src="https://latex.codecogs.com/svg.latex?\large&space;a=0.01,b=100,v=1,k=h=2">. The initial values of <img src="https://latex.codecogs.com/svg.latex?\large&space;d"> and <img src="https://latex.codecogs.com/svg.latex?\large&space;n"> are generated randomly in the range from 0 to 0.2 (with uniform distribution). During simulation, values of the parameters are updated using the <a href="https://encyclopediaofmath.org/wiki/Runge-Kutta_method" target="_blank">Runge-Kutta method</a>.

<b>Important note:</b> the boundary conditions are zero Delta activity (meaning that cell walls that look into the void don't see any Delta molecules, which results in outer cells being more susceptible to higher Delta levels).

Finally, <b>color scheme</b>: colors only represent value of <img src="https://latex.codecogs.com/svg.latex?\large&space;d"> -- 0 is cyan and 1 is fuchsia.
