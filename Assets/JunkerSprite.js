#pragma strict

var spriteT : Sprite;
var spriteL : Sprite;
var spriteR : Sprite;
var spriteD : Sprite;
var spriteC : Sprite;

function SetSprite (roll: int, pitch: int, depth: int) {

	var renderer : SpriteRenderer = gameObject.GetComponent(SpriteRenderer);

	if(roll == 1 && pitch == 1){
		renderer.sprite = spriteT;
	}
	else if(roll == 0 && pitch == 1){
		renderer.sprite = spriteL;
	}
	else if(roll == 2 && pitch == 1){
		renderer.sprite = spriteR;
	}
	else if(roll == 1 && pitch == 0){
		renderer.sprite = spriteD;
	}	
	else if(roll == 1 && pitch == 2){
		renderer.sprite = spriteC;
	}	
	
	switch(depth){
	
		case 0:
			transform.localScale = Vector3(0.6,0.6,1);
			break;
		case 1:
			transform.localScale = Vector3(0.8,0.8,1);
			break;
		case 2:
			transform.localScale = Vector3(1,1,1);
			break;
	}
}