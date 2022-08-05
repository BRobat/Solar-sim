import { Calculus } from 'src/app/utils/calculus'
import { Camera } from '../../camera';
import { Data } from '../../data';
import { Entity } from '../../entity';
import { Matrix4 } from '../../matrix4';
import { Vector } from '../../vector';
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

  positionAttributeLocation: any;
  dataAttributeLocation: any;
  colorAttributeLocation: any;

  nv: number;

  zFar = 10000;

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
    const projectionMatrix = Calculus.perspective(this.fieldOfViewRadians, aspect, zNear, this.zFar);

    // Compute the position of the first F
    // const fPosition = [0, radius, 0];
    const fPosition = [0, 0, 0];

    // Use matrix math to compute a position on the circle.
    let cameraMatrix = Calculus.yRotation(camera.position.y / 100 + Math.PI / 2);
    cameraMatrix = Calculus.translate(cameraMatrix, camera.position.z, 0, 0);
    // Get the camera's postion from the matrix we computed
    // const cameraPosition = [
    //   cameraMatrix[12],
    //   cameraMatrix[13],
    //   cameraMatrix[14],
    // ];
    const cameraPosition = [
      cameraMatrix[12],
      cameraMatrix[13],
      cameraMatrix[14],
    ];

    const up = [0, 0, 1];

    // Compute the camera's matrix using look at.
    cameraMatrix = Calculus.lookAt(cameraPosition, fPosition, up);

    // Make a view matrix from the camera matrix.
    const viewMatrix = Calculus.inverse(cameraMatrix);

    // create a viewProjection matrix. This will both apply perspective
    // AND move the world so that the camera is effectively the origin
    const viewProjectionMatrix = Calculus.multiply(projectionMatrix, viewMatrix);

    // Draw 'F's in a circle
    const matrix = Calculus.translate(viewProjectionMatrix, 1, 1, 1);

    // // Set the matrix.
    this.gl.uniformMatrix4fv(this.matrixLocation, false, matrix);

    // Draw the geometry.
    const primitiveType = this.gl.TRIANGLES;
    const offset = 0;
    const count = this.nv;
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

    this.setGeometry(data, camera);

    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 3;          // 3 components per iteration
    var type = this.gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    this.gl.vertexAttribPointer(
      this.positionAttributeLocation, size, type, normalize, stride, offset);


    // const dataBuffer = this.gl.createBuffer();
    // this.gl.bindBuffer(this.gl.ARRAY_BUFFER, dataBuffer);
    // this.setData(data);

    // this.gl.enableVertexAttribArray(this.dataAttributeLocation);

    // var size = 3;          // 3 components per iteration
    // var type = this.gl.FLOAT;   // the data is 32bit floats
    // var normalize = false; // don't normalize the data
    // var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    // var offset = 0;  
    // this.gl.vertexAttribPointer(
    //   this.dataAttributeLocation, size, type, normalize, stride, offset);


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

  setGeometry(data: Data, camera: Camera) {

    const pos = [];

    this.nv = 0;



    data.entities?.forEach((e: Entity) => {
      // get distance between camera and entity
      const dist = Calculus.vectorLength(Calculus.vectorDistance(e.position, camera.position)); // check this maybe it should be cartesian distance

      // calculate n of triangles

      let noTriangles = this.zFar / dist;
      if (noTriangles < 4) {
        noTriangles = 4;
      } else if (noTriangles > 12) {
        noTriangles = 12;
      } else {
        noTriangles = Math.floor(noTriangles);
      }

      // find angles between camera - entity vector and basic plane (?)

      // alpha = acos(a/dist)

      const xa = Math.acos(Calculus.module(camera.position.x - e.position.x) / dist);
      const ya = Math.acos(Calculus.module(camera.position.y - e.position.y) / dist);

      const points = []

      // create set of points from which [0] is a center
      for (let ii = 0; ii < noTriangles; ii++) {
        if (ii === 0) {
          points.push({ x: 0, y: 0, z: 0 } as Vector);
        } else {
          points.push(
            {
              x: e.diameter / 2 * Math.cos(Math.PI * 2 * ii / noTriangles),
              y: e.diameter / 2 * Math.sin(Math.PI * 2 * ii / noTriangles),
              z: 0
            } as Vector);
        }
      }
      // rotate each point but [0] in the system where [0] is (0,0,0)
      points.forEach((p: Vector) => {
        let pointM = [
          p.x, 0, 0, 0,
          0, p.y, 0, 0,
          0, 0, p.z, 0,
          0, 0, 0, 1
        ] as Matrix4
        pointM = Calculus.xRotate(pointM, xa);
        pointM = Calculus.xRotate(pointM, ya);
      })
      // create triangles


      for (let ii = 0; ii < noTriangles; ii++) {
        
        if (ii < noTriangles - 2) {
          this.nv += 9;
          pos.push(
            e.position.x,
            e.position.y,
            e.position.z,
            e.position.x + points[ii + 1].x,
            e.position.y + points[ii + 1].y,
            e.position.z + points[ii + 1].z,
            e.position.x + points[ii + 2].x,
            e.position.y + points[ii + 2].y,
            e.position.z + points[ii + 2].z
          );
        } else if (ii === noTriangles - 2) {
            e.position.x,
            e.position.y,
            e.position.z,
            e.position.x + points[ii + 1].x,
            e.position.y + points[ii + 1].y,
            e.position.z + points[ii + 1].z,
            e.position.x + points[1].x,
            e.position.y + points[1].y,
            e.position.z + points[1].z
        } else {
          pos.push(
            e.position.x,
            e.position.y,
            e.position.z,
            e.position.x + points[ii].x,
            e.position.y + points[ii].y,
            e.position.z + points[ii].z,
            e.position.x + points[1].x,
            e.position.y + points[1].y,
            e.position.z + points[1].z,
          );
        }
      }

      // rotate plane to be perpendicular to the camera


    });

    let positions = new Float32Array(pos);
    let matrix = Calculus.xRotation(Math.PI);
    matrix = Calculus.translate(matrix, -50, -75, -15);

    for (let ii = 0; ii < positions.length; ii += 3) {
      const vector = Calculus.transformVector(matrix, [positions[ii + 0], positions[ii + 1], positions[ii + 2], 1]);
      positions[ii + 0] = vector[0];
      positions[ii + 1] = vector[1];
      positions[ii + 2] = vector[2];
    }

    // maybe return array with numbers of triangles for each entity

    this.gl.bufferData(this.gl.ARRAY_BUFFER, positions, this.gl.STATIC_DRAW);
  };

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
      for (let ii = 0; ii < 36; ii++) {
        pos.push(e.mass / 160, 200 - (e.mass / 160), 200 - (e.mass / 160))
      }
    })

    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Uint8Array(pos),
      this.gl.STATIC_DRAW);
  };
}
