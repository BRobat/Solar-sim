import { Calculus } from 'src/app/utils/calculus'
import { Matrix4 } from '../../matrix4';
import { FragmentShaders } from './fs'
import { VertexShaders } from './vs'
// import * as webglUtils from '@luma.gl/webgl/dist/es5'


export class GraphicEngineTwo {

  program;
  gl;
  vertexShaderSource;
  fragmentShaderSource;

  // vao <=> vertex array object
  vao: any;

  matrixLocation: Matrix4;

  fieldOfViewRadians: number;
  cameraAngleRadians: number;

  constructor(canvas) {

    this.gl = canvas.nativeElement.getContext('webgl2')
    this.vertexShaderSource = VertexShaders.vs;
    this.fragmentShaderSource = FragmentShaders.fs;

    this.fieldOfViewRadians = Math.PI / 2;
    this.cameraAngleRadians = Math.PI / 2;
    this.init()
  }

  init(): void {
    if (!this.gl) {
      return;
    }
    // create GLSL shaders, upload the GLSL source, compile the shaders
    let vertexShader = this.createShader(this.gl, this.gl.VERTEX_SHADER, this.vertexShaderSource);
    let fragmentShader = this.createShader(this.gl, this.gl.FRAGMENT_SHADER, this.fragmentShaderSource);
    // Link the two shaders into a program
    this.program = this.createProgram(this.gl, vertexShader, fragmentShader);

    let positionAttributeLocation = this.gl.getAttribLocation(this.program, "a_position");
    let colorAttributeLocation = this.gl.getAttribLocation(this.program, "a_color");

    this.matrixLocation = this.gl.getUniformLocation(this.program, "u_matrix");

    let positionBuffer = this.gl.createBuffer();


    this.vao = this.gl.createVertexArray();

    this.gl.bindVertexArray(this.vao);

    this.gl.enableVertexAttribArray(positionAttributeLocation);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);

    // set geometry should display points (or temporarily boxes)
    this.setGeometry(this.gl);

    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 3;          // 3 components per iteration
    var type = this.gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    this.gl.vertexAttribPointer(
      positionAttributeLocation, size, type, normalize, stride, offset);

    // create the color buffer, make it the current ARRAY_BUFFER
    // and copy in the color values
    var colorBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, colorBuffer);
    this.setColors(this.gl);

    // Turn on the attribute
    this.gl.enableVertexAttribArray(colorAttributeLocation);

    // Tell the attribute how to get data out of colorBuffer (ARRAY_BUFFER)
    var size = 3;          // 3 components per iteration
    var type = this.gl.UNSIGNED_BYTE;   // the data is 8bit unsigned bytes
    var normalize = true;  // convert from 0-255 to 0.0-1.0
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next color
    var offset = 0;        // start at the beginning of the buffer
    this.gl.vertexAttribPointer(
      colorAttributeLocation, size, type, normalize, stride, offset);

  }

  drawScene() {

    if (!this.program) {
      return;
    }
    const numFs = 5;
    const radius = 200;

    // find a substitute
    // webglUtils.resizeCanvasToDisplaySize(gl.canvas);

    // Tell WebGL how to convert from clip space to pixels
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

    // Clear the canvas
    this.gl.clearColor(0, 0, 0, 0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    // turn on depth testing
    this.gl.enable(this.gl.DEPTH_TEST);

    // tell webgl to cull faces
    this.gl.enable(this.gl.CULL_FACE);

    // Tell it to use our program (pair of shaders)
    this.gl.useProgram(this.program);

    // Bind the attribute/buffer set we want.
    this.gl.bindVertexArray(this.vao);

    // Compute the matrix

    const aspect = (this.gl.canvas.clientWidth + 1) / (this.gl.canvas.clientHeight + 1);
    const zNear = 1;
    const zFar = 2000;
    const projectionMatrix = Calculus.perspective(this.fieldOfViewRadians, aspect, zNear, zFar);

    // Compute the position of the first F
    const fPosition = [radius, 0, 0];

    // Use matrix math to compute a position on the circle.
    let cameraMatrix = Calculus.yRotation(this.cameraAngleRadians);
    cameraMatrix = Calculus.translate(cameraMatrix, 0, 50, radius * 1.5);

    // Get the camera's postion from the matrix we computed
    const cameraPosition = [
      cameraMatrix[12],
      cameraMatrix[13],
      cameraMatrix[14],
    ];

    const up = [0, 1, 0];

    // Compute the camera's matrix using look at.
    cameraMatrix = Calculus.lookAt(cameraPosition, fPosition, up);

    // Make a view matrix from the camera matrix.
    const viewMatrix = Calculus.inverse(cameraMatrix);

    // create a viewProjection matrix. This will both apply perspective
    // AND move the world so that the camera is effectively the origin
    const viewProjectionMatrix = Calculus.multiply(projectionMatrix, viewMatrix);

    // Draw 'F's in a circle
    for (let ii = 0; ii < numFs; ++ii) {
      const angle = ii * Math.PI * 2 / numFs;

      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const matrix = Calculus.translate(viewProjectionMatrix, x, 0, z);

      // Set the matrix.
      this.gl.uniformMatrix4fv(this.matrixLocation, false, matrix);

      // Draw the geometry.
      const primitiveType = this.gl.TRIANGLES;
      const offset = 0;
      const count = 16 * 6;
      this.gl.drawArrays(primitiveType, offset, count);
    }
  }

  createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
      return shader;
    }

    console.log(gl.getShaderInfoLog(shader));  // eslint-disable-line
    gl.deleteShader(shader);
    return undefined;
  };

  createProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
      return program;
    }

    console.log(gl.getProgramInfoLog(program));  // eslint-disable-line
    gl.deleteProgram(program);
    return undefined;
  };

  setGeometry(gl) {

    var positions = new Float32Array([
      // left column front
      0, 0, 0,
      0, 150, 0,
      30, 0, 0,
      0, 150, 0,
      30, 150, 0,
      30, 0, 0,
    ]);
    let matrix = Calculus.xRotation(Math.PI);
    matrix = Calculus.translate(matrix, -50, -75, -15);

    for (let ii = 0; ii < positions.length; ii += 3) {
      const vector = Calculus.transformVector(matrix, [positions[ii + 0], positions[ii + 1], positions[ii + 2], 1]);
      positions[ii + 0] = vector[0];
      positions[ii + 1] = vector[1];
      positions[ii + 2] = vector[2];
    }

    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
  };

  setColors(gl) {
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Uint8Array([
        // left column front
        200, 70, 120,
        200, 70, 120,
        200, 70, 120,
        200, 70, 120,
        200, 70, 120,
        200, 70, 120,
      ]),
      gl.STATIC_DRAW);
  };
}
