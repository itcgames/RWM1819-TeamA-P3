const LevelLoader = (function() {

  /**
   * @param {string} dataString String representation of the loaded json object.
   * @param {ProgressEvent} e event handler.
   * @this {LevelLoader}
   */
  function loadJson(dataString, e) {
    
    /** @type {Array<{ WorldBounds: { minX: number, minY: number, maxX: number, maxY: number }, Paddle: { position: { x: number, y: number }}, Bricks: Array<{ type: string, position: { x: number, y: number }, width: number, height: number }>, Enemies: Array<{ type: string, position: { x: number, y: number }, velocity: { x: number, y: number }, width: number, height: number}> }>} */
    const data = JSON.parse(dataString);
    return data;
  }

  /**
   * @param {string} filePath File path to json file.
   * @param {(ev: XMLHttpRequestEventMap["load"], data: Array<{ WorldBounds: { minX: number, minY: number, maxX: number, maxY: number }, Paddle: { position: { x: number, y: number }}, Bricks: Array<{ type: string, position: { x: number, y: number }, width: number, height: number }>, Enemies: Array<{ type: string, position: { x: number, y: number }, velocity: { x: number, y: number }, width: number, height: number}> }>) => void} successCallback
   *  function is called when level is fully loaded successfully.
   * @param {(ev: XMLHttpRequestEventMap["error"]) => void} failureCallback
   *  function is called when level does not load successfully.
   * @this {LevelLoader}
   */
  function sendRequest(filePath, successCallback, failureCallback) {
    const request = new XMLHttpRequest();
    request.open("GET", filePath, true);
    request.responseType = "text";
    request.addEventListener("load", function (e) {
      this.levels = loadJson(request.responseText, e);
      successCallback(e, this.levels);
      this.loaded = true;
    }.bind(this), false);
    request.addEventListener("error", function (e) {
      console.error("Failed to load json data [" + filePath + "]");
      failureCallback(e);
    }, false);
    request.send();
  }

  class LevelLoader {
    /**
     * constucts the level and begins the loading process.
     * @param {string} filePath Designated file path for json file.
     * @param {(ev: XMLHttpRequestEventMap["load"], data: Array<{ WorldBounds: { minX: number, minY: number, maxX: number, maxY: number }, Paddle: { position: { x: number, y: number }}, Bricks: Array<{ type: string, position: { x: number, y: number }, width: number, height: number }>, Enemies: Array<{ type: string, position: { x: number, y: number }, velocity: { x: number, y: number }, width: number, height: number}> }>) => void} successCallback
     *  function is called when level is fully loaded successfully.
     * @param {(ev: XMLHttpRequestEventMap["error"]) => void} failureCallback
     *  function is called when level does not load successfully.
     */
    constructor(filePath, successCallback, failureCallback) {
      this.loaded = false;
      /** @type {Array<{ WorldBounds: { minX: number, minY: number, maxX: number, maxY: number }, Paddle: { position: { x: number, y: number }}, Bricks: Array<{ type: string, position: { x: number, y: number }, width: number, height: number }>, Enemies: Array<{ type: string, position: { x: number, y: number }, velocity: { x: number, y: number }, width: number, height: number}> }>} */
      this.levels = [];
      sendRequest.call(this, filePath, successCallback, failureCallback);
    }

    /**
     * Halts execution
     */
    waitUntilLoaded() {
      while (!this.loaded) { }
    }
  }

  return LevelLoader;
})();