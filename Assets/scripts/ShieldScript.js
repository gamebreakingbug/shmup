#pragma strict

import System.Collections.Generic;


var nn : Sprite;
var ww : Sprite;
var ss : Sprite;
var ee : Sprite;

var hitbox : GameObject;

var shieldHashtable : Hashtable = new Hashtable();

function Start () {

		shieldHashtable[0f] = nn;
		shieldHashtable[90f] = ww;
		shieldHashtable[180f] = ss;
		shieldHashtable[270f] = ee;
		shieldHashtable[360f] = nn;
		
}

function Update () {
		
// **** ROTATE TRANSFORM IN 45° INCREMENTS **** //
		
		// Get input from second thumbstick (horiz + vertical axes must be inverted in Input Inspector)
			var xAxis : float; // = Input.GetAxis("Horizontal2");
			var yAxis : float; // = Input.GetAxis("Vertical2");
			
		// Get Radians from Horizontal and Vertical inputs and then convert to Degrees 
			
			var degrees : float = Mathf.Atan2(xAxis,yAxis) * Mathf.Rad2Deg;
			
		// Convert negative degrees to eulerAngles(0 to 360°)
		
			if(degrees<0f){
				degrees = 360f + degrees;
			}
		
		// Snap to 90°
		
			degrees = Mathf.Ceil(degrees/90f) * 90f;
			
		// Get Sprite from Hashtable
		
			var shieldSprite : Sprite = shieldHashtable[degrees];
			var renderer : SpriteRenderer = gameObject.GetComponent(SpriteRenderer);
			var box : BoxCollider2D = hitbox.GetComponent(BoxCollider2D);
			if (xAxis == 0 && yAxis ==0){
				renderer.sprite = null;
				box.enabled = false;
			}
			else {
				renderer.sprite = shieldSprite;
				box.enabled = true;
			}
    		
    		hitbox.transform.eulerAngles = new Vector3(transform.eulerAngles.x, transform.eulerAngles.y, degrees);
		
		// Rotate transform around Z axis
		
		//	transform.eulerAngles = new Vector3(transform.eulerAngles.x, transform.eulerAngles.y, degrees);
		
		/////

}