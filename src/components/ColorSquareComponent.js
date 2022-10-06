import '../css/ColorSquare.css';
import {useEffect} from 'react'


function ColorSquare(props){

  const twgl = window.twgl;

  useEffect(()=>{
    console.log('twgl', twgl);

    const gl = document.querySelector('canvas').getContext('webgl');

    const tl = [255, 0, 0];
    const tr = [255, 255, 0];
    const bl = [0, 0, 255];
    const br = [0, 255, 0];

    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0, // mip level
      gl.RGB,  // internal format
      2,  // width,
      2,  // height,
      0,  // border
      gl.RGB, // format
      gl.UNSIGNED_BYTE, // type
      new Uint8Array([...bl, ...br, ...tl, ...tr]));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    const vs = `
attribute vec4 position;
attribute vec2 texcoord;
varying vec2 v_texcoord;
void main() {
  gl_Position = position;
  v_texcoord = texcoord;
}
`;

    const fs = `
precision mediump float;
varying vec2 v_texcoord;
uniform sampler2D tex;
void main() {
  gl_FragColor = texture2D(tex, v_texcoord);
}
`;

    const program = twgl.createProgram(gl, [vs, fs]);
    const positionLoc = gl.getAttribLocation(program, 'position');
    const texcoordLoc = gl.getAttribLocation(program, 'texcoord');

    function createBufferAndSetupAttribute(loc, data) {
      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(
        loc,
        2,  // 2 elements per iteration
        gl.FLOAT,  // type of data in buffer
        false,  // normalize
        0,  // stride
        0,  // offset
      );
    }

    createBufferAndSetupAttribute(positionLoc, [
      -1, -1,
      1, -1,
      -1,  1,
      -1,  1,
      1, -1,
      1,  1,
    ]);
    createBufferAndSetupAttribute(texcoordLoc, [
      0,  0,
      1,  0,
      0,  1,
      0,  1,
      1,  0,
      1,  1,
    ]);

    gl.useProgram(program);
    // note: no need to set sampler uniform as it defaults
    // to 0 which is what we'd set it to anyway.
    gl.drawArrays(gl.TRIANGLES, 0, 6);


  }, []);

  return(
    <>
      <span className="colorsquare">
      <canvas className="colorsquarecanvas"  style={{width:"50%", height:"35px"}}/>
        <div className="colorsquarelabels" style={{ top:"0%", left:"100%"}}>g1:min, g2:max</div>
        <div className="colorsquarelabels" style={{ top:"-35px", left:"100%"}}>g1:max, g2:max</div>
        <div className="colorsquarelabels" style={{ top:"0%", right:"45%"}}>g1:min, g2:min</div>
        <div className="colorsquarelabels" style={{ top:"-35px", right:"45%"}}>g1:max, g2:min</div>
      </span>
    </>
  );
}

export default ColorSquare;

// https://stackoverflow.com/questions/44877904/how-do-you-import-a-javascript-package-from-a-cdn-script-tag-in-react
