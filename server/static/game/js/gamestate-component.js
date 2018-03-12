/**
 * Game state 
 */
AFRAME.registerComponent('gamestate-component', {
  schema: {
    message: {type: 'string', default: 'Hello, World!'},
    seconds: {type: 'int', default: 0},
  },

  init() {
    this.onKeyUp = this.onKeyUp.bind(this);
    document.addEventListener("keyup", this.onKeyUp);

    // Print state - emit printState event on the element to log its state
    this.onPrintState = this.onPrintState.bind(this);
    this.el.addEventListener('printState', this.onPrintState);

    // Cached element selectors
    this.topLeft = document.querySelector('#top-left');
    this.top = document.querySelector('#top');
    
    // Only the owner of the state may update it
    if (NAF.utils.isMine(this.el)) {
      this.updateColor();
      // Update owner info label
      this.topLeft.textContent = `State owner ${NAF.clientId}`;
      // Count up every second
      setInterval(this.countUp.bind(this), 1000);
    }
  },

  countUp() {
    const newSeconds = this.data.seconds + 1;
    this.el.setAttribute("gamestate-component", { seconds: newSeconds });
  },

  onPrintState() {
    console.log(this.data);
  },

  onKeyUp(e) {
    if (e.keyCode !== 13 /* enter */) {
      return;
    }

    if (NAF.utils.takeOwnership(this.el)) {
      this.updateColor();
    }
  },

  updateColor() {
    const headColor = document.querySelector("#player .head").getAttribute("material").color;
    this.el.setAttribute('material', 'color', headColor);
  },

  // Formats seconds into minutes:seconds
  fmtMSS(s) {
    return (s-(s%=60))/60+(9<s?':':':0')+s
  },
  
  // What to do when component updates
  update(oldData) {
    // all users
    this.top.textContent = this.fmtMSS(this.data.seconds);
    
    // for users that does not own the state
    if (!NAF.utils.isMine(this.el)) {
      return;
    }
    
    // for the user that owns the state
    // console.log('update() - data', this.data);
  }
});