const dots_cnt = 150;
const normal_dot_color = "black";
const red_dot_color = "red";
const circle_color = "blue";
const line_color = "green";
const dots_size = 3;
let dots = [];
let center = [0, 0];
let before_center = [0, 0];
let moving_rate = 0.1;
const moving_rate_change = 0.9;
const end_moving_rate = 0.0005;
const smooth_const = 30;
let smooth = 0;
let farthest_distsq = -1;
let farthest_dot_num = -1;
const speed_const = 1.05;


function rand_dot(){
  while(1){
    let first_rand = Math.random();
    let second_rand = Math.random();
    if(distsq([first_rand*width, second_rand*height], [width/2, height/2]) < (width/2)*(width/4)){
      return [first_rand*width, second_rand*height];
    }
  }
}
function draw_dot(Dpair){
  noStroke();
  fill(normal_dot_color);
  ellipse(Dpair[0], Dpair[1], 3, 3);
  return false;
}
function draw_redot(Dpair){
  noStroke();
  fill(red_dot_color);
  ellipse(Dpair[0], Dpair[1], 3, 3);
  return false;
}
function draw_oldcenter(Dpair){
  noStroke();
  fill(0, 255, 0);
  ellipse(Dpair[0], Dpair[1], 3, 3);
  return false;
}
function draw_oldcenter_invs(Dpair, invs){
  noStroke();
  fill(0, 255, 0, invs);
  ellipse(Dpair[0], Dpair[1], 3, 3);
  return false;
}
function draw_all_dots(Dpairarr){
  for(let i = 0; i<dots_cnt; i++){
    draw_dot(Dpairarr[i]);
  }
  return false;
}
function initial_draw(Dpairarr){
  background("white");
  draw_all_dots(Dpairarr);
  return false;
}
function distsq(Dpair1, Dpair2){
  return ((Dpair2[0] - Dpair1[0])*(Dpair2[0] - Dpair1[0]) + (Dpair2[1] - Dpair1[1])*(Dpair2[1] - Dpair1[1]));
}
function draw_circle(Cent, Point){
  noFill();
  stroke(circle_color);
  ellipse(Cent[0], Cent[1], Math.sqrt(distsq(Cent, Point))*2, Math.sqrt(distsq(Cent, Point))*2);
}
function draw_circle_invs(Cent, Point, invs){
  noFill();
  stroke(0, 0, 255, invs);
  ellipse(Cent[0], Cent[1], Math.sqrt(distsq(Cent, Point))*2, Math.sqrt(distsq(Cent, Point))*2);
}
function draw_line(P1, P2){
  stroke(line_color);
  line(P1[0], P1[1], P2[0], P2[1]);
}
function draw_line_invs(P1, P2, invs){
  stroke(0, 255, 0, invs);
  line(P1[0], P1[1], P2[0], P2[1]);
}
function move_center(C, newC, dis){
  let totx = newC[0] - C[0];
  let toty = newC[1] - C[1];
  let fir = C[0] + totx*dis;
  let sec = C[1] + toty*dis;
  return [fir, sec];
}
function start_text(){
  let s = "Heuristic min-enclosing-circle algorithm";
  
  textFont("Courier New");
  textSize(20);
  fill(50);
  text(s, 10, 10, 70, 80);
}
function print_rad(Pt1){
  let s = "R = ";
  s += Math.sqrt(distsq(center, Pt1)).toFixed(3);
  textFont("Courier New");
  textSize(20);
  fill(50);
  text(s, width - 160, 25);
}
function print_x(Pt1){
  let s = "x = ";
  s += Pt1[0].toFixed(3);
  textFont("Courier New");
  textSize(20);
  fill(50);
  text(s, width - 160, 45);
}
function print_y(Pt1){
  let s = "y = ";
  s += Pt1[1].toFixed(3);
  textFont("Courier New");
  textSize(20);
  fill(50);
  text(s, width - 160, 65);
}
function print_state(Pnt){
  print_rad(Pnt);
  print_x(center);
  print_y(center);
}
function print_state_smt(Pnt, Pnt2){
  print_rad(Pnt);
  print_x(Pnt2);
  print_y(Pnt2);
}

function setup(){
  let mn = min(window.innerWidth, window.innerHeight);
  createCanvas(mn, mn);
  start_text();
  background("white");
  for(let i = 0; i < dots_cnt; i++){
    dots.push(rand_dot());
    center[0] += dots[i][0]/dots_cnt;
    center[1] += dots[i][1]/dots_cnt;
    draw_dot(dots[i]);
  }
  frameRate(2 * smooth_const);
}

function draw(){
  if(smooth % smooth_const == 0){
    //0. reset without dots and (new)center
    initial_draw(dots);
    draw_oldcenter(center);
    start_text();
    //1. find farthest dot
    farthest_distsq = -1;
    farthest_dot_num = -1;
    for(let i = 0; i<dots_cnt; i++){
      if(farthest_distsq < distsq(center, dots[i])){
        farthest_distsq = distsq(center, dots[i]);
        farthest_dot_num = i;
      }
    }
    //2. draw a line between center and farthest dot
    draw_line(center, dots[farthest_dot_num]);
    //3. draw a circle
    draw_circle(center, dots[farthest_dot_num]);
    //4. move center
    before_center = center;
    center = move_center(center, dots[farthest_dot_num], moving_rate);
    //draw_redot(center);
    //5. print state
    print_state(dots[farthest_dot_num]);
    //6. change moving rate
    moving_rate *= moving_rate_change;
  }else{
    let color_inv = (smooth_const - (smooth % smooth_const)) * 150/smooth_const;
    initial_draw(dots);
    draw_oldcenter_invs(before_center, color_inv);
    start_text();
    draw_line_invs(before_center, dots[farthest_dot_num], color_inv);
    draw_circle_invs(before_center, dots[farthest_dot_num], color_inv);
    let moved_rate = min(1, (smooth%smooth_const)*speed_const/smooth_const);
    let moving_center = [0, 0];
    moving_center[0] = before_center[0] + (center[0]-before_center[0])*moved_rate;
    moving_center[1] = before_center[1] + (center[1]-before_center[1])*moved_rate;
    draw_redot(moving_center);
    //draw_redot(move_center(before_center, center, moved_rate));
    print_state_smt(dots[farthest_dot_num], moving_center);
  }
  if(moving_rate < end_moving_rate) {
    noLoop();
  }
  smooth++;
}

//feedbacks
//x, y coordinates, radius -> ok