#pragma strict

public class Moveables extends MonoBehaviour {

  var speed : float;
  enum Edge{Horiz, Vert};

  var velocity : Vector2;

  function SetVelocity(x:float,y:float){

      velocity.x = x;
      velocity.y = y;

    }

  function SetMove(bank:float, thrust:float){

        if (thrust == 0 && bank == 0){
          SetVelocity(velocity.x * 0.95f, velocity.y * 0.95f);
        }
        else {
          SetVelocity(speed * bank, speed * thrust);
        }


  }

	function Move(vel: Vector2){

		rigidbody2D.MovePosition(rigidbody2D.position + vel * Time.deltaTime );

	}

  function Shake(duration : float,magnitude : float) {

  		var elapsed : float = 0.0f;
  		var originalCamPos : Vector3 = Camera.main.transform.position;

  		while (elapsed < duration) {
  			elapsed += Time.deltaTime;

  			var percentComplete : float = elapsed / duration;
  			var damper : float = 1.0f - Mathf.Clamp(4.0f * percentComplete - 3.0f, 0.0f, 1.0f);

  			// map value to [-1, 1]
  			var x : float = Random.value * 2.0f - 1.0f;
  			var y : float = Random.value * 2.0f - 1.0f;

  			x *= magnitude * damper;
  			y *= magnitude * damper;

  			Camera.main.transform.position = new Vector3(x, y, originalCamPos.z);
  			yield;

  		}

  		Camera.main.transform.position = originalCamPos;
  }


}
