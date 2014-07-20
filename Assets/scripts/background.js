#pragma strict

public class background extends MonoBehaviour
    {

	    var speedY : float;
	     
	    function Update ()
	    {

		    var movement : Vector3 = new Vector3(0f, speedY, 0f);
		    movement *= Time.deltaTime;
			transform.Translate(movement);
	    }
    }