#pragma strict

var spriteT : Sprite;
var spriteL : Sprite;
var spriteR : Sprite;
var spriteD : Sprite;
var spriteC : Sprite;
var spriteRR : Sprite;
var spriteRL : Sprite;

function SetSprite (state: State, depth: Depth) {

	var renderer : SpriteRenderer = gameObject.GetComponent(SpriteRenderer);

	if(state == State.Cruising){
		renderer.sprite = spriteT;
	}
	else if(state == State.BankingL){
		renderer.sprite = spriteL;
	}
	else if(state == State.BankingR){
		renderer.sprite = spriteR;
	}
	else if(state == State.Diving){
		renderer.sprite = spriteD;
	}	
	else if(state == State.Climbing){
		renderer.sprite = spriteC;
	}	
	else if(state == State.RollingR){
		renderer.sprite = spriteRR;
	}
	else if(state == State.RollingL){
		renderer.sprite = spriteRL;
	}		
	
	switch(depth){
	
		case Depth.Bottom:
			transform.localScale = Vector3(0.6,0.6,1);
			break;
		case Depth.Middle:
			transform.localScale = Vector3(0.8,0.8,1);
			break;
		case Depth.Top:
			transform.localScale = Vector3(1,1,1);
			break;
	}
}