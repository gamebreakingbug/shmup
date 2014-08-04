#pragma strict

	  var window : GameObject;

  	enum State{Cruising, Climbing, Diving, BankingL, BankingR, RollingL, RollingR, Boosting};
	  enum Depth{Bottom, Middle, Top};

public class ControllerClass extends Moveables {

    private var stateHashtable : Hashtable = new Hashtable();
  	private var bounce : boolean;
    private var transitioning : boolean;


    var leftDash : AudioClip;
    var rightDash : AudioClip;
    private var shipAudio : AudioSource;

  	var state : State;
    var depth : Depth;

    var thrust : float;
  	var bank : float;
    var pitch : float;
    var roll : float;

  	function CheckInput(){

    	  thrust = Input.GetAxis("Vertical");
    	  bank = Input.GetAxis("Horizontal");
        pitch = Input.GetAxis("Vertical2");
        roll = Input.GetAxis("Horizontal2");

        if (pitch == -1 && depth != depth.Top && state == State.Cruising){
          state = State.Climbing;
          }
        else if (pitch == 1 && depth != depth.Bottom && state == State.Cruising){
          state = State.Diving;
          }
        else if (roll == 1 && (state == State.Cruising || state == State.BankingR)){
          state = State.RollingR;
          }
        else if (roll == -1  && (state == State.Cruising || state == State.BankingL)){
          state = State.RollingL;
          }
        else if (state == State.Cruising && Input.GetButtonDown("Boost")){
          state = State.Boosting;
        }
        else if (bank >= 0.4){
          state = State.BankingR;
          }
        else if (bank <= -0.4){
          state = State.BankingL;
          }
        else {
          state = State.Cruising;
        }

        if(!bounce){
          SetMove(bank,thrust);
        }
  	}

  	function ScreenCheck(){

  			var screenBounds : Vector3;
  			var screenOffset : Vector3;

  			screenBounds = Vector3(Screen.width,Screen.height,0);
  			screenOffset.x = (screenBounds.x*6)/100; // 6% of Screen width
  			screenOffset.y = (screenBounds.y*6)/100; // 6% of Screen height

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

    function Transitioning(array : Array){

        var cameraSize : float = Camera.main.orthographicSize;
        var renderer : SpriteRenderer = gameObject.GetComponent(SpriteRenderer);
        var currentSpr : Sprite;
        var sizeMod : float; // used for climbing / diving
        var rollSpeed : float = 24;
        var boostSpeed : float = 20;
        var loop : int = array.length - 1;
        var newPos : Vector2;
        var d : int = depth;
        var depthMod : float = 0.5 + (0.25 * d);


        if(state == State.RollingR){
            shipAudio.PlayOneShot(rightDash);
            newPos =  Vector2(((speed * rollSpeed)/cameraSize)/100,0);
            transform.position.x += cameraSize * (newPos.x * depthMod);
            SetVelocity(speed,0);
            }
        else if(state == State.RollingL){
            shipAudio.PlayOneShot(leftDash);
            newPos =  Vector2(((speed * rollSpeed)/cameraSize)/100,0);
            transform.position.x += cameraSize * (-newPos.x * depthMod);
            SetVelocity(-speed,0);
            }
        else if(state == State.Boosting){
              newPos =  Vector2(0,((speed * boostSpeed)/cameraSize)/100);
              transform.position.y += cameraSize * (newPos.y * depthMod);
              SetVelocity(0, speed);
              }

        for(var i = 0; i<loop; i++){
          currentSpr = array[i];
          renderer.sprite = currentSpr;
          yield WaitForSeconds(0.08);
        }

        currentSpr = array[loop];
        renderer.sprite = currentSpr;

        if(state == State.Climbing){

            sizeMod =  ( 28 / cameraSize ) / 100; //  + 20 px (+ 36 px)
            transform.position.y += cameraSize * sizeMod;
            depth += 1;

        }

        else if(state == State.Diving){

          if(depth == Depth.Top){

            sizeMod =  ( 48 / cameraSize ) / 100; // + 48 px (+ 52 px)
            transform.position.y += cameraSize * sizeMod;
          }

          else if(depth == Depth.Middle){

            sizeMod =  ( 32 / cameraSize ) / 100; // + 52 px (+ 68 px)
            transform.position.y += cameraSize * sizeMod;
          }

          depth -= 1;

        }

        if(state == State.RollingL || state == State.RollingR){
            SetVelocity(velocity.x * -0.1f, velocity.y);

        }

        if(state == State.Boosting){
            sizeMod =  ( 28 / cameraSize ) / 100; //  + 20 px (+ 36 px)
            transform.position.y += cameraSize * sizeMod;
            SetVelocity(velocity.x, velocity.y  * -0.1f);
        }

        transitioning = false;
        state = State.Cruising;

    }

  	function SpriteRend(){

        var currentSpr : Sprite;
        var currentHashtable : Hashtable = stateHashtable[depth];

        if(!transitioning){

            if(state == State.Climbing || state == State.Diving || state == State.RollingL || state == State.RollingR || state == State.Boosting){
              transitioning = true;
              Transitioning(currentHashtable[state]);

            }

            else{

              currentSpr = currentHashtable[state];
          		var renderer : SpriteRenderer = gameObject.GetComponent(SpriteRenderer);
      		    renderer.sprite = currentSpr;

            }
        }
  	}


    function Start(){

      var Spr : Sprite[] = Resources.LoadAll.<Sprite>("Images/new-junker");

      var topHashtable : Hashtable = new Hashtable();
      var tDVarray = [Spr[3],Spr[13],Spr[1]];
      var tRLarray = [Spr[28],Spr[32],Spr[36],Spr[0]];
      var tRRarray = [Spr[16],Spr[20],Spr[24],Spr[0]];  //  var tRRarray = [Spr[16],Spr[20],Spr[8]];
      var tBSarray = [Spr[23],Spr[35],Spr[12],Spr[0]];

      topHashtable[State.Cruising] = Spr[0];
      topHashtable[State.BankingL] = Spr[4];
      topHashtable[State.BankingR] = Spr[8];
      topHashtable[State.Diving] = tDVarray;
      topHashtable[State.Boosting] = tBSarray;
      topHashtable[State.RollingL] = tRLarray;
      topHashtable[State.RollingR] = tRRarray;

      var middleHashtable : Hashtable = new Hashtable();
      var mDVarray = [Spr[11],Spr[14],Spr[2]];
      var mCMarray = [Spr[7],Spr[12],Spr[0]];
      var mRLarray = [Spr[29],Spr[33],Spr[37],Spr[1]];
      var mRRarray = [Spr[17],Spr[21],Spr[25],Spr[1]];
      var mBSarray = [Spr[27],Spr[39],Spr[13],Spr[1]];

      middleHashtable[State.Cruising] = Spr[1];
      middleHashtable[State.BankingL] = Spr[5];
      middleHashtable[State.BankingR] = Spr[9];
      middleHashtable[State.Diving] = mDVarray;
      middleHashtable[State.Climbing] = mCMarray;
      middleHashtable[State.Boosting] = mBSarray;
      middleHashtable[State.RollingL] = mRLarray;
      middleHashtable[State.RollingR] = mRRarray;

      var bottomHashtable : Hashtable = new Hashtable();
      var bCMarray = [Spr[15],Spr[19],Spr[1]];
      var bRLarray = [Spr[30],Spr[34],Spr[38],Spr[2]];
      var bRRarray = [Spr[18],Spr[22],Spr[26],Spr[2]];
      var bBSarray = [Spr[31],Spr[40],Spr[14],Spr[2]];

      bottomHashtable[State.Cruising] = Spr[2];
      bottomHashtable[State.BankingL] = Spr[6];
      bottomHashtable[State.BankingR] = Spr[10];
      bottomHashtable[State.Climbing] = bCMarray;
      bottomHashtable[State.Boosting] = bBSarray;
      bottomHashtable[State.RollingL] = bRLarray;
      bottomHashtable[State.RollingR] = bRRarray;

      stateHashtable[Depth.Top] = topHashtable;
      stateHashtable[Depth.Middle] = middleHashtable;
      stateHashtable[Depth.Bottom] = bottomHashtable;

      depth = Depth.Middle;
      shipAudio = gameObject.GetComponent("AudioSource");

    }

    function FixedUpdate () {

        window.GetComponent(GUIText).text = "velocity = " + velocity + "\n" + "thrust = " + thrust + "\n" + "bank = " + bank + "\n" + "pitch = " + pitch + "\n" + "roll = " + roll + "\n" + "depth = " + depth + "\n" + "state = " + state + "\n" + "transitioning = " + transitioning;

        if(!transitioning){
          CheckInput();
        }
        Move(velocity);
        ScreenCheck();
        SpriteRend();

    }

}
