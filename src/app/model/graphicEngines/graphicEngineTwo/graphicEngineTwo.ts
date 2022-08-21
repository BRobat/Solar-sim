import { Calculus } from 'src/app/utils/calculus'
import { Camera } from '../../camera';
import { Data } from '../../data';
import { Entity } from '../../entity';
import { Matrix4 } from '../../matrix4';
import { Vector } from '../../vector';
import { Cube } from './cube';
import { Disc } from './disc';
import { FragmentShaders } from './fs'
import { VertexShaders } from './vs'
// import * as webglUtils from '@luma.gl/webgl/dist/es5'


export class GraphicEngineTwo {

  program;
  gl;
  vertexShaderSource;
  fragmentShaderSource;


  viewProjectionMatrix;

  // vao <=> vertex array object
  vao: any;


  matrixLocation: Matrix4;

  fieldOfViewRadians: number;
  cameraAngleRadians: number;

  nv: number = 0;

  positionAttributeLocation: any;
  dataAttributeLocation: any;
  colorAttributeLocation: any;

  constructor(canvas) {

    this.gl = canvas.nativeElement.getContext('webgl2')
    this.vertexShaderSource = VertexShaders.vs;
    this.fragmentShaderSource = FragmentShaders.fs;

    this.fieldOfViewRadians = Math.PI / 3;
    this.cameraAngleRadians = Math.PI / 3;
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

    this.positionAttributeLocation = this.gl.getAttribLocation(this.program, "a_position");
    this.dataAttributeLocation = this.gl.getAttribLocation(this.program, "a_data");
    this.colorAttributeLocation = this.gl.getAttribLocation(this.program, "a_color");

    this.matrixLocation = this.gl.getUniformLocation(this.program, "u_matrix");



    // set geometry should display points (or temporarily boxes)

  }

  drawScene(data: Data, camera: Camera) {

    if (!this.program) {
      return;
    }

    this.stuffConfig(data, camera);

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
    const zFar = 10000;
    const projectionMatrix = Calculus.perspective(this.fieldOfViewRadians, aspect, zNear, zFar);

    let cameraPosition = [
      camera.dist * Math.cos(camera.theta) * Math.sin(camera.phi),
      camera.dist * Math.sin(camera.theta) * Math.sin(camera.phi),
      camera.dist * Math.cos(camera.phi)
    ];

    camera.position.x = cameraPosition[0]
    camera.position.y = cameraPosition[1]
    camera.position.z = cameraPosition[2]

    const up = [0, 0, 1]

    const cameraMatrix = Calculus.lookAt(cameraPosition, [0, 0, 0], up)
    // Make a view matrix from the camera matrix.
    const viewMatrix = Calculus.inverse(cameraMatrix);

    // create a viewProjection matrix. This will both apply perspective
    // AND move the world so that the camera is effectively the origin
    this.viewProjectionMatrix = Calculus.multiply(projectionMatrix, viewMatrix);

    const matrix = Calculus.translate(this.viewProjectionMatrix, 1, 1, 1);

    // // Set the matrix.
    this.gl.uniformMatrix4fv(this.matrixLocation, false, matrix);

    let noTriangles = 0

    data.entities?.forEach((e: Entity) => {
      noTriangles += e.triangles;
    })

    // Draw the geometry.
    const primitiveType = this.gl.TRIANGLES;
    const offset = 0;
    const count = noTriangles * 3;
    this.gl.drawArrays(primitiveType, offset, count);

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

  stuffConfig(data: Data, camera: Camera) {

    let positionBuffer = this.gl.createBuffer();


    this.vao = this.gl.createVertexArray();

    this.gl.bindVertexArray(this.vao);

    this.gl.enableVertexAttribArray(this.positionAttributeLocation);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);

    // create positions for draw

    const positions = []
    data.entities?.forEach((e: Entity) => {
      positions.push(...this.setGeometry(e, camera));
    })

    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions), this.gl.STATIC_DRAW);

    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 3;          // 3 components per iteration
    var type = this.gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    this.gl.vertexAttribPointer(
      this.positionAttributeLocation, size, type, normalize, stride, offset);

    // create the color buffer, make it the current ARRAY_BUFFER
    // and copy in the color values
    var colorBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, colorBuffer);
    this.setColors(data);

    // Turn on the attribute
    this.gl.enableVertexAttribArray(this.colorAttributeLocation);

    // Tell the attribute how to get data out of colorBuffer (ARRAY_BUFFER)
    var size = 3;          // 3 components per iteration
    var type = this.gl.UNSIGNED_BYTE;   // the data is 8bit unsigned bytes
    var normalize = true;  // convert from 0-255 to 0.0-1.0
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next color
    var offset = 0;        // start at the beginning of the buffer
    this.gl.vertexAttribPointer(
      this.colorAttributeLocation, size, type, normalize, stride, offset);
  }

  setGeometry(e: Entity, camera: Camera): number[] {

    let positions = [];

    // positions.push(...Cube.drawCube(e.diameter))
    // e.triangles = 12;

    positions.push(...Disc.drawDisc(e, camera))



    let matrix = Calculus.lookAt([0, 0, 0], [camera.position.x - e.position.x, camera.position.y - e.position.y, camera.position.z - e.position.z], [0, 0, 1])
    // let matrix = Calculus.xRotation(0);
    // matrix = Calculus.yRotate(matrix,0)

    matrix[12] = 0
    matrix[13] = 0
    matrix[14] = 0


    for (let ii = 0; ii < positions.length; ii += 3) {
      const vector = Calculus.transformVector(matrix, [positions[ii + 0], positions[ii + 1], positions[ii + 2], 1]);
      positions[ii + 0] = vector[0] + e.position.x;
      positions[ii + 1] = vector[1] + e.position.y;
      positions[ii + 2] = vector[2] + e.position.z;
    }

    return positions
  }



  setData(data: Data) {

    const d = [];

    data.entities?.forEach((e: Entity) => {
      d.push(e.force.x, e.force.y, e.force.z)
    })

    const dat = new Float32Array(d);

    this.gl.bufferData(this.gl.ARRAY_BUFFER, dat, this.gl.STATIC_DRAW);
  }

  setColors(data: Data) {
    const pos = [];

    data.entities?.forEach((e: Entity) => {
      for (let ii = 0; ii < e.triangles; ii++) {
        pos.push(e.mass / 160, 200 - (e.mass / 160), 200 - (e.mass / 160))
        pos.push(e.mass / 160, 200 - (160), 200 - (e.mass / 160))
        pos.push(e.mass / 160, 200 - (e.mass / 160), 200 - (160))
      }
    })

    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Uint8Array(pos),
      this.gl.STATIC_DRAW);
  };
}
