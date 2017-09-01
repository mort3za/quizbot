<?php 

/** 
* Pugin Name: Quiz Functions Plugin 
* Description: This plugin contains all of our custom functions. 
* Author: Morteza Ziaeemehr (@mort3za)
* Version: 1.1.1
*/

// NIK LATEST POSTS
// ------------------------------------------
add_action( 'rest_api_init', function () {
	register_rest_route( 'quiz/v1', '/quiz/(?P<id>\d+)', array(
						    'methods' => 'GET',
						    'callback' => 'get_quiz',
						  ) );
}
);
add_action( 'rest_api_init', function () {
	register_rest_route( 'quiz/v1', '/quizzes', array(
						    'methods' => 'GET',
						    'callback' => 'get_quizzes',
						  ) );
}
);
add_action( 'rest_api_init', function () {
	register_rest_route( 'quiz/v1', '/register', array(
						    'methods' => 'POST',
						    'callback' => 'signup',
						  ) );
}
);

function get_quiz( $data ) {
	
	global $wpdb;
	
	$sql =  $wpdb->prepare( 
		"SELECT * FROM `{$wpdb->prefix}mlw_questions` WHERE quiz_id = %d", $data['id']
	  );
	
	$list = $wpdb->get_results($sql);
	
	if ( empty( $list ) ) {
		return null;
	}
	return $list;
}

function get_quizzes( $data ) {
	
	global $wpdb;
	
	$sql =  $wpdb->prepare( 
		"SELECT * FROM `{$wpdb->prefix}mlw_quizzes` WHERE deleted = %d", 0
	  );
	
	$list = $wpdb->get_results($sql);
	
	if ( empty( $list ) ) {
		return [];
	}
	return $list;
}
