<?php
    /*
     * Simulate an ajax user name check
     */
    sleep(3);// Zzzz...
    header('Content-type: application/json');
    echo json_encode(
        !empty($_REQUEST['jquery_validate']) && 
        strlen($_REQUEST['jquery_validate']) > 2 &&
        $_REQUEST['jquery_validate'] !== 'sirmaxelot' // simulate that this username is already taken
    );
?>
