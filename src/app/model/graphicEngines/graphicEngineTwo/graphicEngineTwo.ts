import { Calculus } from 'src/app/utils/calculus'
import { FragmentShaders } from './fs'
import { VertexShaders } from './vs'
// import * as webglUtils from '@luma.gl/webgl/dist/es5'


export class GraphicEngineTwo {

  program
  gl
  vertexShaderSource
  fragmentShaderSource

  constructor(canvas) {
    this.gl = canvas.getContext('webgl2')
    this.vertexShaderSource = VertexShaders.vs;
    this.fragmentShaderSource = FragmentShaders.fs;
    this.init()
  }

  init() {
    if (!this.gl) {
      return;
    }
    // create GLSL shaders, upload the GLSL source, compile the shaders
    let vertexShader = this.createShader(this.gl, this.gl.VERTEX_SHADER, this.vertexShaderSource);
    let fragmentShader = this.createShader(this.gl, this.gl.FRAGMENT_SHADER, this.fragmentShaderSource);

    // Link the two shaders into a program
    let program = this.createProgram(this.gl, vertexShader, fragmentShader);

    let positionAttributeLocation = this.gl.getAttribLocation(this.program, "a_position");
    let colorAttributeLocation = this.gl.getAttribLocation(this.program, "a_color");

    let matrixLocation = this.gl.getUniformLocation(this.program, "u_matrix");

    let positionBuffer = this.gl.createBuffer();

    // vao <=> vertex array object
    let vao = this.gl.createVertexArray();

    this.gl.bindVertexArray(vao);

    this.gl.enableVertexAttribArray(positionAttributeLocation);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);

    // set geometry should display points (or temporarily boxes)
    this.setGeometry(this.gl);

  }

  drawScene(gl) {

    if (!this.program) {
      return;
    }
    const numFs = 5;
    const radius = 200;

    // find a substitute
    // webglUtils.resizeCanvasToDisplaySize(gl.canvas);

    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Clear the canvas
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // turn on depth testing
    gl.enable(gl.DEPTH_TEST);

    // tell webgl to cull faces
    gl.enable(gl.CULL_FACE);

    // Tell it to use our program (pair of shaders)
    gl.useProgram(this.program);

    // Bind the attribute/buffer set we want.
    gl.bindVertexArray(vao);

    // Compute the matrix
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 1;
    const zFar = 2000;
    const projectionMatrix = Calculus.perspective(fieldOfViewRadians, aspect, zNear, zFar);

    // Compute the position of the first F
    const fPosition = [radius, 0, 0];

    // Use matrix math to compute a position on the circle.
    let cameraMatrix = Calculus.yRotation(cameraAngleRadians);
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
    for (const ii = 0; ii < numFs; ++ii) {
      const angle = ii * Math.PI * 2 / numFs;

      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const matrix = Calculus.translate(viewProjectionMatrix, x, 0, z);

      // Set the matrix.
      gl.uniformMatrix4fv(matrixLocation, false, matrix);

      // Draw the geometry.
      const primitiveType = gl.TRIANGLES;
      const offset = 0;
      const count = 16 * 6;
      gl.drawArrays(primitiveType, offset, count);
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
    const matrix = Calculus.xRotation(Math.PI);
    matrix = Calculus.translate(matrix, -50, -75, -15);
  
    for (const ii = 0; ii < positions.length; ii += 3) {
      const vector = Calculus.transformVector(matrix, [positions[ii + 0], positions[ii + 1], positions[ii + 2], 1]);
      positions[ii + 0] = vector[0];
      positions[ii + 1] = vector[1];
      positions[ii + 2] = vector[2];
    }
  
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
  }


}
