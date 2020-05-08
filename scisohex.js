/**CONSTANTS */
const DPI_SCALE = window.devicePixelRatio
const SCALE_STEP = 0.1
const MAX_SCALE = 30
const MIN_SCALE = 500
const POSITION_FACTOR = [ 0.85, 0.755 ]

/*CANVAS RENDERING */
let canvas_el = window.canvas_el
let context_2d = canvas_el.getContext( "2d" )
let render_scale = 100
let render_offset = [ 0, 0 ]
let viewport_rect = [ 0, 0, 1, 1 ]

function update_canvas_size () {
  canvas_el.width = window.innerWidth * DPI_SCALE
  canvas_el.height = window.innerHeight * DPI_SCALE
}

function draw_hex ( x_index, y_index, color ) {
  color = color || `#${(Math.floor(Math.random() * 0xFFFFFF)).toString(16)}`
  context_2d.fillStyle = color

  context_2d.font = `${Math.max(1, 0.1 * render_scale)}px sans-serif`;
  context_2d.strokeStyle = "#00bcd4"
  context_2d.fillStyle = "#131313"
  context_2d.lineWidth = 2
  context_2d.beginPath()

  let x_offset = ( y_index % 2 ) === 0 ? (0.5) * render_scale : 0

  let x = (((x_index) * render_scale) + x_offset ) * POSITION_FACTOR[0] + render_offset[ 0 ]
  let y = ((y_index) * render_scale) * POSITION_FACTOR[1] + render_offset[ 1 ]

  context_2d.moveTo(x + ( render_scale / 2 ) * Math.cos(0 + (Math.PI / 2)), y + ( render_scale / 2 ) * Math.sin(0 + (Math.PI / 2)));

  for (let i = 0; i < 7; i++) {
    context_2d.lineTo(x + ( render_scale / 2 ) * Math.cos((i * 2 * Math.PI / 6)  + (Math.PI / 2)), y + ( render_scale / 2 ) * Math.sin((i * 2 * Math.PI / 6)  + (Math.PI / 2)));
  }

  context_2d.closePath()
  context_2d.fill()
  context_2d.fillStyle = "#ffffff"
  context_2d.textAlign = "center"
  context_2d.fillText(`${x_index.toFixed(0)} : ${y_index.toFixed(0)}`, x, y);
  context_2d.stroke()
}

function update_viewport () {
  let x = Math.floor(-(render_offset[0] / render_scale)  / POSITION_FACTOR[0])
  let y =  Math.floor(-(render_offset[1] / render_scale) / POSITION_FACTOR[1]) 

  let width = Math.ceil( ((1 / render_scale) * (window.innerWidth)) / POSITION_FACTOR[0] ) + 2
  let height = Math.ceil( ((1 / render_scale) * (window.innerHeight))  / POSITION_FACTOR[1] ) + 2

  // console.log()

  viewport_rect = [ x, y, width, height ]
  console.log(viewport_rect)
}

function render () {
  requestAnimationFrame ( render )
  context_2d.clearRect( 0, 0, canvas_el.width, canvas_el.height )

  for ( let a = viewport_rect[0]; a < viewport_rect[0] + viewport_rect[2]; a++ ){
    for (let b = viewport_rect[1]; b < viewport_rect[1] + viewport_rect[3]; b++) {
        draw_hex( a, b, "#000000" ) 
    }
  }

  // for ( let b = 0; b < 10; b++ ){
  //     for (let a = 0; a < 10; a++) {
  //         draw_hex( a, b, "#000000" ) 
  //     }
  //   }
}

function setup_canvas_interactivity () {
  canvas_el.addEventListener( "mousewheel", ( evt )=>{
    // console.log(evt.deltaY)
    if ( evt.deltaY > 0 ) {
      render_scale *= ( 1 + SCALE_STEP )
      if ( render_scale > MIN_SCALE ) render_scale = MIN_SCALE
    } else {
      render_scale *= ( 1 - SCALE_STEP )
      if ( render_scale < MAX_SCALE ) render_scale = MAX_SCALE
    }
    // console.log(render_scale)
    update_viewport()
  } )



  let captured = false
  let prev_pos = [ 0, 0 ] 

  document.addEventListener( "mousedown", ( evt )=>{
    let mouse_x = evt.pageX
    let mouse_y = evt.pageY
    prev_pos[0] = mouse_x
    prev_pos[1] = mouse_y

    captured = true
  } )

  document.addEventListener( "mousemove", ( evt )=>{
    if ( captured ) {
      let mouse_x = evt.pageX
      let mouse_y = evt.pageY

      let delta_x = mouse_x - prev_pos[0]
      let delta_y = mouse_y - prev_pos[1]

      render_offset[0] += delta_x
      render_offset[1] += delta_y
      
      update_viewport()

      prev_pos[0] = mouse_x
      prev_pos[1] = mouse_y
    }
  } )

  document.addEventListener( "mouseup", ()=>{
    captured = false
  } )
}

/** SCISO HEX */
update_canvas_size()
update_viewport()
setup_canvas_interactivity()
window.addEventListener( "resize", ()=>{
  update_canvas_size()
} )

requestAnimationFrame ( render )

// console.log(canvas_el)
