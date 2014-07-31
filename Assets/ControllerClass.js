#pragma strict

	  var window : GameObject;

  	enum State{Cruising, Climbing, Diving, BankingL, BankingR, RollingL, RollingR};
	  enum Depth{Bottom, Middle, Top};

public class ControllerClass extends Moveables {

    var tCr : Sprite;
    var tBl : Sprite;
    var tBr : Sprite;
    var tDv1 : Sprite;
    var tDv2 : Sprite;

  	var mCr : Sprite;
  	var mBl : Sprite;
  	var mBr : Sprite;
    var mCl1 : Sprite;
    var mCl2 : Sprite;
    var mDv1 : Sprite;
    var mDv2 : Sprite;

    var bCr : Sprite;
    var bBl : Sprite;
    var bBr : Sprite;
    var bCl1 : Sprite;
    var bCl2 : Sprite;

    private var stateHashtable : Hashtable = new Hashtable();
  	private var bounce : boolean;
    private var rolling : boolean;

  	var state : State;
    var depth : Depth;
  	var thrust : float;
  	var bank : float;
    var pitch : float;

    function Start(){

      var topHashtable : Hashtable = new Hashtable();
      var tDvArray = [tDv1, tDv2];
      topHashtable[State.Cruising] = tCr;
      topHashtable[State.BankingL] = tBl;
      topHashtable[State.BankingR] = tBr;
      topHashtable[State.Diving] = tDvArray;

      var middleHashtable : Hashtable = new Hashtable();
      var mClArray = [mCl1, mCl2];
      var mDvArray = [mDv1, mDv2];
      middleHashtable[State.Cruising] = mCr;
      middleHashtable[State.BankingL] = mBl;
      middleHashtable[State.BankingR] = mBr;
      middleHashtable[State.Climbing] = mClArray;
      middleHashtable[State.Diving] = mDvArray;

      var bottomHashtable : Hashtable = new Hashtable();
      var bClArray = [bCl1, bCl2];
      bottomHashtable[State.Cruising] = bCr;
      bottomHashtable[State.BankingL] = bBl;
      bottomHashtable[State.BankingR] = bBr;
      bottomHashtable[State.Climbing] = bClArray;

      stateHashtable[Depth.Top] = topHashtable;
      stateHashtable[Depth.Middle] = middleHashtable;
      stateHashtable[Depth.Bottom] = bottomHashtable;

      depth = Depth.Middle;
    }


  	function CheckInput(){

    	  thrust = Input.GetAxis("Vertical");
    	  bank = Input.GetAxis("Horizontal");
        pitch = Input.GetAxis("Vertical2");

    		if(!bounce){

          if(!rolling && depth != depth.Top && Input.GetButtonDown("LeftBumper")){
            state = State.Climbing;
            //BarrelRoll("LeftBumper");
          }
          else if(!rolling && depth != depth.Bottom &&  Input.GetButtonDown("RightBumper")){
            state = State.Diving;
            //BarrelRoll("RightBumper");
          }
          else if (!rolling){
    		    SetMove(bank,thrust);
          }
        }

  	}

    function BarrelRoll(bumper : String){

        var rollSpeed : float;

        switch(bumper){
          case "LeftBumper":
            rollSpeed = speed * -4;
            break;
          case "RightBumper":
            rollSpeed = speed * 4;
            break;
          default:
            break;
        }
        rolling = true;
        SetVelocity(rollSpeed , velocity.y);
        while(Input.GetButton(bumper)){
          SetVelocity(velocity.x * 0.95f, velocity.y);
          yield;
        }
          rolling = false;
    }


  	function ScreenCheck(){

  			var screenBounds : Vector3;
  			var screenOffset : Vector3;

  			screenBounds = Vector3(Screen.width,Screen.height,0);
  			screenOffset.x = (screenBounds.x*6)/100; // 6% of Screen width
  			screenOffset.y = (screenBounds.y*12)/100; // 6% of Screen height

  			var currentPos : Vector3 = Camera.main.WorldToScreenPoint(transform.position);

  			if((currentPos.x > screenBounds.x-screenOffset.x && velocity.x > 0) || (currentPos.x < screenOffset.x && velocity.x < 0))
  				{
  				Bounce(Edge.Horiz);
  				}
  			if((currentPos.y > screenBounds.y-screenOffset.y && velocity.y > 0) || (currentPos.y < screenOffset.y && velocity.y < 0))
  				{
  				Bounce(Edge.Vert);
  				}
  	}

  	function Bounce(contact : Edge){

    		bounce = true;

        // Shake(0.2f,0.1f);

    		if(contact == Edge.Horiz){
    			SetVelocity(velocity.x * -1.0f, velocity.y); // flip horizontal direction
    			while(bank !=0){
    				velocity *= 0.95f;
    				yield;
    			}
    		}

    		else {
    			SetVelocity(velocity.x, velocity.y * -1.0f); // flip vertical direction
    			while(thrust !=0){
    				velocity *= 0.95f;
    				yield;
    			}
    		}

    		bounce = false;

  	}

    function TransitionAnim(array : Array){

        for(var i = 0; i<array.length; i++){
          var currentSpr : Sprite = array[i];
          var renderer : SpriteRenderer = gameObject.GetComponent(SpriteRenderer);
          renderer.sprite = currentSpr;
          yield WaitForSeconds(0.1);
        }

        if(state == State.Climbing){
          depth += 1;
        }
        else if(state == State.Diving){
          depth -= 1;
        }
        state = State.Cruising;
    }

  	function SpriteRend(){

        var currentSpr : Sprite;
        var currentHashtable : Hashtable = stateHashtable[depth];

        if(state == State.Climbing || state == State.Diving){

          TransitionAnim(currentHashtable[state]);

        }

        else{

          currentSpr = currentHashtable[state];
      		var renderer : SpriteRenderer = gameObject.GetComponent(SpriteRenderer);


            if(velocity.x < 0.4 && velocity.x > -0.4){
              state = State.Cruising;
            }
            else if (bank >= 0.4){
      				state = State.BankingR;
      				}
      			else if (bank <= -0.4){
      				state = State.BankingL;
      				}
      			else{
      				state = State.Cruising;
      			}
      		renderer.sprite = currentSpr;

        }
  	}

    function FixedUpdate () {

        window.GetComponent(GUIText).text = "velocity = " + velocity + "\n" + "thrust = " + thrust + "\n" + "bank = " + bank + "\n" + "depth = " + depth + "\n" + "state = " + state;

        CheckInput();
        Move(velocity);
        ScreenCheck();
        SpriteRend();

    }

}
