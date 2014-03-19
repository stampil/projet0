var auto_switch = false;
var name_ship ='';
var nb_ship='';
var c;
var ctx;
var help_menu_left =null;
var timer_alert=null;
var API_SC=0;
var theme='b';
var allow_swipe=true;
var ctx_chart;
var opt_chart = {"segmentStrokeWidth":1};
var data_pie;

/**pledge**/
var first_check=0;
var first_check2=0;
var percent_max = 0;
var percent_max2 = 0;
var current_anim = true;
var current_anim2 = true;
var nb_bars = 30;
var connected=true;

var ship= new Array();
var nb_ship=0;
ship[nb_ship++] = {nom:"Aurora MR",img:"auroramr.jpg",constructor:"RSI",role:"Interdiction",crew:1};
ship[nb_ship++] = {nom:"Aurora ES",img:"auroraes.jpg",constructor:"RSI",role:"Exploration",crew:1};
ship[nb_ship++] = {nom:"Aurora CL",img:"auroracl.jpg",constructor:"RSI",role:"Mercantile",crew:1};
ship[nb_ship++] = {nom:"Aurora LN",img:"auroraln.jpg",constructor:"RSI",role:"Militia/Patrol",crew:1};
ship[nb_ship++] = {nom:"Aurora LX",img:"auroralx.jpg",constructor:"RSI",role:"Exploration/Light Mercantile",crew:1};
ship[nb_ship++] = {nom:"300I",img:"300i.jpg",constructor:"Origin Jumpworks",role:"Touring",crew:1};
ship[nb_ship++] = {nom:"315P",img:"315p.jpg",constructor:"Origin Jumpworks",role:"Exploration",crew:1};
ship[nb_ship++] = {nom:"325A",img:"325a.jpg",constructor:"Origin Jumpworks",role:"Interdiction",crew:1};
ship[nb_ship++] = {nom:"350R",img:"350r.jpg",constructor:"Origin Jumpworks",role:"Racing",crew:1};
ship[nb_ship++] = {nom:"M50",img:"m50.jpg",constructor:"Origin Jumpworks",role:"Racing",crew:1};
ship[nb_ship++] = {nom:"F7A Hornet",img:"hornetf7a.jpg",constructor:"Anvil Aerospace",role:"Military Close Support",crew:1};
ship[nb_ship++] = {nom:"F7C Hornet",img:"hornetf7c.jpg",constructor:"Anvil Aerospace",role:"Civilian Close Support",crew:1};
ship[nb_ship++] = {nom:"F7C-S Hornet Ghost",img:"hornetghost.jpg",constructor:"Anvil Aerospace",role:"Infiltration",crew:1};
ship[nb_ship++] = {nom:"F7C-R Hornet Tracker",img:"hornettracker.jpg",constructor:"Anvil Aerospace",role:"Scout/Command and Control",crew:1};
ship[nb_ship++] = {nom:"F7C-M Super Hornet",img:"hornetsuper.jpg",constructor:"Anvil Aerospace",role:"Space Superiority",crew:2};
ship[nb_ship++] = {nom:"Avenger",img:"avenger.jpg",constructor:"Aegis Dynamics",role:"Interceptor/Interdiction",crew:1};
ship[nb_ship++] = {nom:"Avenger Trainer",img:"avenger.jpg",constructor:"Aegis Dynamics",role:"Training",crew:2};
ship[nb_ship++] = {nom:"Vanduul Scythe",img:"vanduul.jpg",constructor:"Unknown",role:"Military Close Support",crew:1};
ship[nb_ship++] = {nom:"Cutlass",img:"cutlass.jpg",constructor:"Drake",role:"Militia/Patrol",crew:2};
ship[nb_ship++] = {nom:"Gladiator",img:"gladiator.jpg",constructor:"Anvil Aerospace",role:"Carrier-Based Bomber",crew:2};
ship[nb_ship++] = {nom:"Freelancer",img:"freelancer.jpg",constructor:"MISC",role:"Mercantile",crew:2};
ship[nb_ship++] = {nom:"Caterpillar",img:"caterpillar.jpg",constructor:"Drake",role:"Transport",crew:5};
ship[nb_ship++] = {nom:"Retaliator",img:"retaliator.jpg",constructor:"Aegis Dynamics",role:"Long-Range Bomber",crew:6};
ship[nb_ship++] = {nom:"Constellation",img:"constellation.jpg",constructor:"RSI",role:"Multi-function",crew:4};
ship[nb_ship++] = {nom:"Starfarer",img:"starfarer.jpg",constructor:"MISC",role:"Transport",crew:2};
ship[nb_ship++] = {nom:"Idris",img:"idris.jpg",constructor:"Aegis Dynamics",role:"Corvette",crew:10};
ship[nb_ship++] = {nom:"Idris-P",img:"idris.jpg",constructor:"Aegis Dynamics",role:"Corvette",crew:10};
ship[nb_ship++] = {nom:"P-52 Merlin",img:"p52.jpg",constructor:"Kruger Intergalactic",role:"Close Support",crew:1};


$( document ).on( "pagecreate", "#page", function() {
	$.event.special.swipe.horizontalDistanceThreshold = 60;
	$.event.special.swipe.verticalDistanceThreshold = 60;
    $( document ).on( "swipeleft swiperight", "#page", function( e ) {
    	if(!allow_swipe) return false;
        // We check if there is no open panel on the page because otherwise
        // a swipe to close the left panel would also open the right panel (and v.v.).
        // We do this by checking the data that the framework stores on the page element (panel: open).
        if ( $( ".ui-page-active" ).jqmData( "panel" ) !== "open" ) {
            if ( e.type === "swipeleft" ) {
                $( "#right-panel" ).panel( "open" );
            } else if ( e.type === "swiperight" ) {
                $( "#left-panel" ).panel( "open" );

            }
        }
    });
  
});


function Offline() {
    $('#online').html('(nc)');
    connected=false;
}


function Online() {
    $('#online').html('(i)');
    connected=true;
}

var ready = null;
function onDeviceReady() {
	clearTimeout(ready);
	ready=1;
    document.addEventListener("offline", Offline, false);
    document.addEventListener("online", Online, false); 

    if(navigator.splashscreen) navigator.splashscreen.hide();

    $(document).ready(function () {
    	
    	//ctx_chart = $("#chart_ship_all").get(0).getContext("2d");
    	
    	

    	c=document.getElementById("canvas");
    	ctx=c.getContext("2d");
        ctx.fillStyle='#151515';
        ctx.font='10px borbitron';
        ctx.fillText(' ', 10, 10);
        ctx.font='10px "orbitron"';
        ctx.fillText(' ', 10, 10);

        $('.handle').show(500);

        
        
        $('#left-menu').click(function(){
        	
        	clearTimeout(help_menu_left);
            help_menu_left = -1;
            $.cookie('tuto',1);
        });

        if ($.cookie('switch-theme') == '1') {
            
            auto_switch = true;
            setTimeout(function () {
                $('.ui-flipswitch').trigger('click');
            }, 501);

        }
        if($.cookie('handle')){
            $('#pseudo').val($.cookie('handle'));
            setTimeout(function(){
                $('#search_pseudo').trigger('click');
            },1000);

        }

        $("ul.ui-listview li a").click(function () {
        	
            var page = $(this).attr('goto');
            if (!page) return false; //li a :close is not a page
            
            allow_swipe = true;
            
            if($(this).attr('need_handle')=='1' && !$.cookie('handle')){
                page='error_need_handle';
            }

            $('.page').hide(300);
            $('.' + page).show(500);

            if(page=='manage_groupe'){
            	show_group();
            }


            $('#close_left_menu').trigger('click');
            return false;
        });
        
                

        $('.ui-flipswitch').click(function () {
           
            if ($('.ui-flipswitch-active').length) {
                $.cookie('switch-theme', 1);
                $('.ui-body-b').removeClass('ui-body-b').addClass('ui-body-a');
                $('.ui-page-theme-b').removeClass('ui-page-theme-b').addClass('ui-page-theme-a');
                theme='a';

            }
            else {
                $('.ui-body-a').removeClass('ui-body-a').addClass('ui-body-b');
                $('.ui-page-theme-a').removeClass('ui-page-theme-a').addClass('ui-page-theme-b');
                theme='b';
                if (!auto_switch) $.cookie('switch-theme', '');
            }
            auto_switch = false;
        });

        translate();
        do_chart();
    	
    	var bar_gen = '';
    	var bar_gen2 = '';
    	 for (var i=1; i<=nb_bars; i++){
    	 	bar_gen+='<img src="img/off.png" alt="|" id="bar_'+i+'"/>';
    	 }
    	 for (var i=1; i<=nb_bars; i++){
    	 	bar_gen2+='<img src="img/off.png" alt="|" id="bar2_'+i+'"/>';
    	 }
    	 $('#bar').html(bar_gen);
    	 $('#bar2').html(bar_gen2);
    	 check_pledge();
    	setInterval(check_pledge,60000); //refresh all minutes

    	
    	 $('body').delegate('.info_manage_group','click', function(){
    		 $('#info_manage_group_'+$(this).attr('info')).show(500);
    	 });
        $('body').delegate('.delete_group','click', function(){
        	
        	var o = $(this).parent();
        	 var ok = confirm('delete '+$(this).attr('name')+'?');  
        	 if(ok){
        	$.ajax({
                type: 'GET',
                url: 'http://vps36292.ovh.net/mordu/API_2.8.php',
                jsonpCallback: 'API_SC'+API_SC++,
                contentType: "application/json",
                dataType: 'jsonp',
                data: 'action=delete_'+$(this).attr('context')+'&team='+$.cookie('team')+'&name='+$(this).attr('name'),
                async: true,
                beforeSend: function(){
                	if(connected){
                		alerte('<div class="waitingForConnection">'+trad_connection_internet+'</div>');
        	        	}
        	        	else{
        	        		alerte('<div class="waitingForConnection">'+trad_error_no_connected+'</div>');
        	        	}

                },
                success: function (data) {
                    
                    o.hide();

                },
                error: function (e) {
                    console.log(e.message);
                }
            });
        	 }
        	
        });
    	
        $('body').delegate('.img_team_team, .img_team_hangar','click', function(){
        	alerte('<img src="'+$(this).attr('src')+'"/><br />' +$(this).attr('alt'));
        });
        
        $('body').delegate('.select_select_player_content','change', function(){
        	$('.select_player_cache[handle="'+$(this).attr('handle')+'"]').css('opacity',0);
        });
        
        $('#select_ship').delegate('.select_ship_text','click', function(){
        	var ship = $(this).attr('ship_name');
        	var SearchInput = $('input[ship_name="'+ship+'"]');
        	SearchInput.val('');
        	SearchInput.trigger('focus');
        });
        

        $('body').delegate('.img_hangar','click', function(){
        	var handle = $(this).attr('handle');
        	var ship =  $(this).attr('ship');
        	if(ship=='no'){
        		alerte(trad_no_ship);
        	}
        	var to_visible= false;
        	if(!$('.hangarteam[handle="'+handle+'"]:visible')[0]){
        		to_visible = true;
        	}
        	
        	$('.hangarteam').hide(300);
        	
        	if(to_visible){
	        	setTimeout(function(){
	        		console.log('show: '+handle);
	        		$('.hangarteam[handle="'+handle+'"]').show(300);
	        	},300);
        	}	
        	

        });
        
        $('body').delegate('.manage_ship_text','click', function(){
        	var o = $(this).parent().find('.manage_ship_cache');
        	name_ship =$(this).text();
        	if (o.css('opacity')==0 ){
        		o.css('opacity',0.85);
        		nb_ship= 0;
        	}
        	else{
        		o.css('opacity',0);
                nb_ship= 1;
        	}
        	save_ship();

        });
        
        $('body').delegate('.select_player_text','click', function(){
        	var o = $(this).parent().find('.select_player_cache');
        	var nb_player = 0;
        	name_player =$(this).text();
        	if (o.css('opacity')==0 ){
        		o.css('opacity',0.95);
        		nb_player= 0;
        	}
        	else{
        		o.css('opacity',0);
        		nb_player= 1;
        	}
        	//save_player(nb_player);

        });
        
        



            

           /* $( "#popupDialog h1" ).html(trad_save_nb_ship);
            $('#confirm_btn_1').html(trad_confirm_yes);
            $('#confirm_btn_1').attr('action','confirm_ship');
            $('#confirm_btn_2').html(trad_confirm_no);
            $( "#popupDialog h3" ).html(trad_confirm_nb_ship.replace('$0', $.cookie('pseudo')).replace('$1',nb_ship).replace('$2',name_ship) + '? ');

            $( "#popupDialog" ).popup("open");*/


        $("#lang :radio[value='" + lang + "']").attr('checked', 'checked');
        $("#lang :radio").checkboxradio("refresh");

        $('#lang :radio').change(
            function () {
                $('a[href="#add-form"]').trigger('click');
                setTimeout(function () {
                    location.href = location.protocol + '//'
                        + location.host + location.pathname
                        + '?lang=' + $("#lang :radio:checked").val();
                }, 100);

            });
        
        $('#alert').click(function(){
        	$('#alert').slideUp(50);
        });
        
        $('#open_open_submit').click(function(){
        	$.ajax({
    	        type: 'GET',
    	        url: 'http://vps36292.ovh.net/mordu/API_2.8.php',
    	        jsonpCallback: 'API_SC'+API_SC++,
    	        contentType: "application/json",
    	        dataType: 'jsonp',
    	        data: 'action=save_open_open&team='+$.cookie('team')+'&name='+ $('#open_open_name').val()+'&max_player='+ $('#open_open_max').val()+'&handle='+ $.cookie('handle'),
    	        async: true,
    	        beforeSend: function(){
    	        	if(connected){
    	        		alerte(trad_connection_internet);
    	        	}
    	        	else{
    	        		alerte(trad_error_no_connected);
    	        	}
    	        },
    	        success: function (data) {
    	            alerte(trad_confirm_ok);
    	            $('a[goto="manage_groupe"]').trigger('click');
    	        },
    	        error: function (e) {
    	            console.log(e.message);
    	        }
    	    });
        });
        
        $('#fixed_fixed_submit').click(function(){
        	var to_save='';
        	$('.select_player_cache').filter(function() {
        	    return $(this).css('opacity') == '0';
        	}).each(function(e){
        		var handle= $(this).attr('handle');
        		var ship = $('.select_select_player_content[handle="'+handle+'"] option:selected').val();
        		to_save+=handle+'☼'+ship+'◙';
        		
        	});
        	
        	$.ajax({
    	        type: 'GET',
    	        url: 'http://vps36292.ovh.net/mordu/API_2.8.php',
    	        jsonpCallback: 'API_SC'+API_SC++,
    	        contentType: "application/json",
    	        dataType: 'jsonp',
    	        data: {
    	        	action:'save_fixed_fixed',
    	        	handle:$.cookie('handle'),
    	        	name:$('#fixed_fixed_name').val(),
    	        	team:$.cookie('team'),
    	        	ship:to_save
    	        },
    	        async: true,
    	        beforeSend: function(){
    	        	if(connected){
    	        		alerte(trad_connection_internet);
    	        	}
    	        	else{
    	        		alerte(trad_error_no_connected);
    	        	}
    	        },
    	        success: function (data) {
    	            alerte(trad_confirm_ok);
    	            $('a[goto="manage_groupe"]').trigger('click');
    	        },
    	        error: function (e) {
    	            console.log(e.message);
    	        }
    	    });
        	
        	
        });
        
        $('#fixed_open_submit').click(function(){
        	var to_save='';
        	$('.select_ship_content .select_ship_text').each(function(e){
        		var ship = $(this).text();
        		var nb = $('input[type="number"][ship_name="'+ship+'"]').val();
        		
        		if(parseInt(nb)>0) {	
        			to_save+=nb+'☼'+ship+'◙';
        		}
        	});
        	
        	$.ajax({
    	        type: 'GET',
    	        url: 'http://vps36292.ovh.net/mordu/API_2.8.php',
    	        jsonpCallback: 'API_SC'+API_SC++,
    	        contentType: "application/json",
    	        dataType: 'jsonp',
    	        data: 'action=save_fixed_open&team='+$.cookie('team')+'&name='+ $('#fixed_open_name').val()+'&ship='+ to_save+'&handle='+ $.cookie('handle'),
    	        async: true,
    	        beforeSend: function(){
    	        	if(connected){
    	        		alerte(trad_connection_internet);
    	        	}
    	        	else{
    	        		alerte(trad_error_no_connected);
    	        	}
    	        },
    	        success: function (data) {
    	            alerte(trad_confirm_ok);
    	            $('a[goto="manage_groupe"]').trigger('click');
    	        },
    	        error: function (e) {
    	            console.log(e.message);
    	        }
    	    });
        	
        	
        });
        
        $('#open_open_max').click(function(){
        	$('#open_open_max').focus().select();
        });
        
        $('#open_fixed_submit').click(function(){
        	$.ajax({
    	        type: 'GET',
    	        url: 'http://vps36292.ovh.net/mordu/API_2.8.php',
    	        jsonpCallback: 'API_SC'+API_SC++,
    	        contentType: "application/json",
    	        dataType: 'jsonp',
    	        data: 'action=save_open_fixed&team='+$.cookie('team')+'&name='+ $('#open_fixed_name').val()+'&players='+ $('#open_fixed_select-button span:nth-child(1)').text()+'&handle='+ $.cookie('handle'),
    	        async: true,
    	        beforeSend: function(){
    	        	if(connected){
    	        		alerte(trad_connection_internet);
    	        	}
    	        	else{
    	        		alerte(trad_error_no_connected);
    	        	}
    	        },
    	        success: function (data) {
    	            alerte(trad_confirm_ok);
    	            $('a[goto="manage_groupe"]').trigger('click');
    	        },
    	        error: function (e) {
    	            console.log(e.message);
    	        }
    	    });
        });
        
         
        

        
        $('#save_lock').click(function(){
        	var saved= false;
        	if($('#mdp_handle').val() && $('#mdp_handle').val() == $('#confirm_mdp_handle').val() ){
        		saved=true;
        	    $.ajax({
        	        type: 'GET',
        	        url: 'http://vps36292.ovh.net/mordu/API_2.8.php',
        	        jsonpCallback: 'API_SC'+API_SC++,
        	        contentType: "application/json",
        	        dataType: 'jsonp',
        	        data: 'action=lock_handle&mdp='+$('#mdp_handle').val()+'&handle='+ $.cookie('handle'),
        	        async: true,
        	        beforeSend: function(){
        	        	if(connected){
        	        		alerte(trad_connection_internet);
        	        	}
        	        	else{
        	        		alerte(trad_error_no_connected);
        	        	}
        	        },
        	        success: function (data) {
        	            alerte(trad_confirm_ok);
        	        },
        	        error: function (e) {
        	            console.log(e.message);
        	        }
        	    });
        	}
        	if($('#mdp_team').val() && $('#mdp_team').val() == $('#confirm_mdp_team').val() ){
        		saved=true;
        	    $.ajax({
        	        type: 'GET',
        	        url: 'http://vps36292.ovh.net/mordu/API_2.8.php',
        	        jsonpCallback: 'API_SC'+API_SC++,
        	        contentType: "application/json",
        	        dataType: 'jsonp',
        	        data: 'action=lock_team&team='+ $.cookie('team')+ '&mdp='+$('#mdp_team').val()+'&handle='+ $.cookie('handle'),
        	        async: true,
        	        beforeSend: function(){
        	        	if(connected){
        	        		alerte(trad_connection_internet);
        	        	}
        	        	else{
        	        		alerte(trad_error_no_connected);
        	        	}
        	        },
        	        success: function (data) {
        	        	 alerte(trad_confirm_ok);
        	        },
        	        error: function (e) {
        	            console.log(e.message);
        	        }
        	    });
        	}
        	if(!saved){
        		alerte(trad_confirm_pass);
        	}
        });

        $('#search_pseudo').click(function () {
            $('#member_guilde').html('');
            $('#info_pseudo').html('');

            var handle = 'gourmand';
            if ($('#pseudo').val()) {
                handle = $('#pseudo').val();

            }



            $.ajax({
                type: 'GET',
                url: 'http://vps36292.ovh.net/mordu/API_2.8.php',
                jsonpCallback: 'API_SC'+API_SC++,
                contentType: "application/json",
                dataType: 'jsonp',
                data: 'action=citizens&page='+ handle+'&mdp='+$('#mdp').val(),
                async: true,
                beforeSend: function(){
                	if(connected){
                		 $('#info_pseudo').html('<div class="waitingForConnection">'+trad_connection_internet+'</div>');
    	        	}
    	        	else{
    	        		 $('#info_pseudo').html('<div class="waitingForConnection">'+trad_error_no_connected+'</div>');
    	        	}

                    $('#info_pseudo').show();
                    ctx.clearRect(0,0,$('#canvas').width(),$('#canvas').height());
                    $('#mdp, .require_mdp, #require_mdp').hide();
                    $.cookie('team','');
                    $.cookie('handle','');
                },
                success: function (data) {

                    if (data.join_date.year) {

                        var link = document.createElement('link');
                        link.rel = 'stylesheet';
                        link.type = 'text/css';
                        link.href = 'http://fonts.googleapis.com/css?family=Vast+Shadow';
                        document.getElementsByTagName('head')[0].appendChild(link);

                        ctx.font='10px borbitron';
                        
                        $('#canvas').css('background','url(img/canevas.png)');
                        var metrics;
                        var width;
                        var font=18;
                        var upp_pseudo = data.pseudo.toUpperCase();

                        do{
                        	ctx.font=font+'px borbitron';
	                        metrics = ctx.measureText(upp_pseudo );
	                        width = metrics.width;
	                        
	                        font--;
                        }
                        while(width>178 && font>9);
                        ctx.fillText( upp_pseudo,125,135);

                        while(data.number.length<8){
                            data.number= '0'+data.number;

                        }
                        ctx.save();
                        ctx.font='12px orbitron';
                        ctx.fillStyle='#151515';
                        ctx.translate(150, 94.5);
                        ctx.rotate(Math.PI/2);
                        ctx.fillText(data.number, -40, 148);
                        ctx.restore();
                        
                        

                        var img = new Image();   // Crée un nouvel objet Image
                        img.src = data.avatar; // Définit le chemin vers sa source
                        img.onload = function(){
                        	ctx.drawImage(img, 216, 35,76,76);
                        	
                        };
                        
                        if(data.team.logo){
	                        var img2 = new Image();
	                        img2.src = data.team.logo;
	                        img2.onload = function() {
	                            ctx.save();
	                            ctx.globalAlpha = 0.3;
	                            ctx.drawImage(img2, 125, 35, 76, 76);
	                            ctx.restore();
	                        };
                        }


                        $('#info_pseudo').html('');
                        
                        
                        
                        translate();

                        $.cookie('team',data.team.tag);
                        $.cookie('handle', data.handle);
                        $('.display_handle').html(data.handle);
                        $('.display_team').html(data.team.tag);
                        $.cookie('pseudo', data.pseudo);
                        if(data.team.name) info_orga();
                     
                        display_ship();

                    }
                    else if(data.err=='MDP_REQUIRED_HANDLE'){ //handle first more important than team
                       
                    	$('#info_pseudo, .require_mdp_team').hide();
                        $('.require_mdp_handle, #mdp').show();
                        
                        $('#require_mdp').show(300);
                        setTimeout(function(){
                            $('#mdp').focus();
                           
                        },350);

                    }
                    else if(data.err=='MDP_REQUIRED_TEAM'){
                        $('#info_pseudo, .require_mdp_handle').hide();
                        $('.require_mdp_team,  #mdp').show();
                        $('#require_mdp').show(300);
                        setTimeout(function(){
                            $('#mdp').focus();
                            $('#trad_info_handle').html('<span class="handle">'+data.requester+'</span>');
                        },350);

                    }

                    else {
                        $('#info_pseudo').html(
                            trad_error_handle);
                    }
                },
                error: function (e) {
                    console.log(e.message);
                }
            });

        });
        $(document).trigger("pagecreate");
    });

}
document.addEventListener("deviceready", onDeviceReady, false);




//switch theme end


function save_ship(){
    $.ajax({
        type: 'GET',
        url: 'http://vps36292.ovh.net/mordu/API_2.8.php',
        jsonpCallback: 'API_SC'+API_SC++,
        contentType: "application/json",
        dataType: 'jsonp',
        data: 'action=save_ship&ship='+ name_ship+ '&nb='+nb_ship+'&handle='+ $.cookie('handle'),
        async: true,
        beforeSend: function(){
        	if(connected){
        		alerte(trad_connection_internet);
        	}
        	else{
        		alerte(trad_error_no_connected);
        	}

        },
        success: function (data) {
           
            alerte(nb_ship+ 'x '+name_ship+ ' '+trad_saved);
            display_hangar();
            info_orga();
           
            $('#confirm').hide();
        },
        error: function (e) {
            console.log(e.message);
        }
    });
}

function translate() {
    $('body').find("[trad]").each(function (index, value) {
        $(this).html(eval($(this).attr('trad')));
    });
}

function display_hangar() {
    $('#your_hangar').html(trad_loading_your_ship);
    $.ajax({
            type: 'GET',
            url: 'http://vps36292.ovh.net/mordu/API_2.8.php',
            jsonpCallback: 'API_SC'+API_SC++,
            contentType: "application/json",
            dataType: 'jsonp',
            data: 'action=get_localship&handle='+ $.cookie('handle'),
            async: true,
            beforeSend: function(){
            	if(connected){
           		 $('#your_hangar').html('<div class="waitingForConnection">'+trad_connection_internet+'</div>');
	        	}
	        	else{
	        		 $('#your_hangar').html('<div class="waitingForConnection">'+trad_error_no_connected+'</div>');
	        	}
            },
            success: function (data) {
                $('#your_hangar').html('<div class="ui-corner-all custom-corners"><div class="ui-bar ui-bar-'+theme+'"><h3 trad="trad_your_ships"></h3></div><div class="ui-body ui-body-'+theme+'">');
                var html = $.cookie('pseudo')+':<br />';
                for (var i = 0; i < data.ship.nb_res; i++) {
                    html +=  '<div class="content_team_hangar"><div class="nb_team_hangar">'+data.ship[i].nb +'x</div><img class="img_team_hangar" src="'+data.ship[i].img+'" alt="'+data.ship[i].name+'" /></div> ';
                    $('.manage_ship_text:contains('+data.ship[i].name+')').parent().find('.manage_ship_cache').css('opacity',0);
                                   
                }
                html+='</div></div></div>';
                $('#your_hangar').html(html);
                
                translate();

            },
            error: function (e) {
                console.log(e.message);
            }
        });
}

function save_infoship(nom,img,role,crew){

	$.ajax({
        type: 'GET',
        url: 'http://vps36292.ovh.net/mordu/API_2.8.php',
        jsonpCallback: 'API_SC'+API_SC++,
        contentType: "application/json",
        dataType: 'jsonp',
        data: 'action=save_infoship&nom='+nom+'&img='+img+'&role='+role+'&crew='+crew,
        async: true,
        success: function (data) {
        },
        error: function (e) {
            console.log(e.message);
        }
    });
}

function display_ship() {

   
    
   $.ajax({
            type: 'GET',
            url: 'http://vps36292.ovh.net/mordu/API_2.8.php',
            jsonpCallback: 'API_SC'+API_SC++,
            contentType: "application/json",
            dataType: 'jsonp',
            data: 'action=localship',
            async: true,
            beforeSend: function(){
            	if(connected){
              		 $('#member_ship').html('<div class="waitingForConnection">'+trad_connection_internet+'</div>');
   	        	}
   	        	else{
   	        		 $('#member_ship').html('<div class="waitingForConnection">'+trad_error_no_connected+'</div>');
   	        	}
            },
            success: function (data) {
               
                var html = '';
                var html2 = '';
                for (var i = 0; i < data.ship.total; i++) {
                                        
                    
                    html +='<div class="manage_ship_content">'
                    	+'<div class="manage_ship_img" ><img src="'
                        + data.ship[i].img  + '" /></div>'
                	+'<div class="manage_ship_cache"></div>'
                	+'<div class="manage_ship_text"><center>'+data.ship[i].nom+'</center></div></div>';
                    
                    html2 +='<div class="select_ship_content">'
                    	+'<div class="select_ship_img" ><img src="'
                        + data.ship[i].img  + '" /></div>'
                	+'<div class="select_ship_text" ship_name="'+data.ship[i].nom+'"><center>'+data.ship[i].nom+'</center></div>'
                	+'<input type="number" min="0" max="250" class="number number_vaisseau" ship_name="'+data.ship[i].nom+'" />'
                	+'</div>';
               }

                
               $('#select_ship').html(html2);
               $('#member_ship').html(html);
               display_hangar();
               $('#select_ship input').textinput();
               $('#select_ship .ui-input-text').addClass('number_ship').addClass('number');
               $("#open_open_max").parent().addClass('number');
               $('.number_vaisseau').css({'text-align':'center','opacity':1}).val(0).click(function(){if($(this).val()==0)$(this).val('');});
               

            },
            error: function (e) {
                console.log(e.message);
            }
        });
    
}

function info_orga() {

    $.ajax({
            type: 'GET',
            url: 'http://vps36292.ovh.net/mordu/API_2.8.php',
            jsonpCallback: 'API_SC'+API_SC++,
            contentType: "application/json",
            dataType: 'jsonp',
            data: 'action=localorg&team=' + $.cookie('team') + '&page=1',
            async: true,
            beforeSend: function(){           	
                if(connected){
             		 $('#member_guilde').html('<div class="waitingForConnection">'+trad_connection_internet+'</div>');
  	        	}
  	        	else{
  	        		 $('#member_guilde').html('<div class="waitingForConnection">'+trad_error_no_connected+'</div>');
  	        	}
            },
            success: function (data) {
                var html = '<div class="ui-corner-all custom-corners"><div class="ui-bar ui-bar-'+theme+'"><h3 trad="trad_your_team"></h3></div><div class="ui-body ui-body-'+theme+'">';
                var html2='';
                var hangar_teammate='';
                var hangar_team ='';
                $('#member_guilde').html();

                if (data.member.nb > 0) {
                	if(data.member.nb>249) data.member.nb = 249; //TODO limite max 249
                	
                	var opt_player='';
                	
                    for (var i = 0; i < data.member.nb; i++) {
                    	hangar_teammate='';
                    	hangar_teammate2='';
                    	for(var j=0; j<data.member[i].ship.nb;j++){
                    		hangar_teammate+= '<div class="content_team_hangar"><div class="nb_team_hangar">'+data.member[i].ship[j].nb +'x</div><img class="img_team_team" src="'+data.member[i].ship[j].img+'" alt="'+data.member[i].ship[j].name+'" /></div> ';
                    		hangar_teammate2+='<option>'+data.member[i].ship[j].name+'</option>';
                    	}
                    	//hangar_teammate = hangar_teammate.substring(0, hangar_teammate.length - 2);
                        
                    	html += '<div><img class="member_guilde_avatar" src="http://robertsspaceindustries.com'+ data.member[i].avatar  + '"  />'
                            + ' <div class="display_pseudo">' + data.member[i].pseudo + '</div><div class="display_handle"> ' + data.member[i].handle + '</div>'
                            
                            + '<div>'+data.member[i].title+'</div>'
                            + '<div style="clear:both"></div></div>'
                            + '<center>';
                    		if(data.member[i].handle){
                    			html+='<p><img src="img/hangar.jpg" class="img_hangar" ship="yes" handle="' + data.member[i].handle + '" /></p>';
                    			
                    			//un membre sans handle ne peut pas avoir de fixed ship
                    			html2 +='<div class="select_player_content">'
                                	+'<div class="select_player_img" ><img src="http://robertsspaceindustries.com'+ data.member[i].avatar  + '" /></div>'
                                	+'<div class="select_player_cache" handle="' + data.member[i].handle + '"></div>'
                                	+'<div class="select_player_text"><center>'+data.member[i].pseudo+'</center></div></div>'
                                	+'<select class="select_select_player_content" handle="'+ data.member[i].handle+'">'+hangar_teammate2+'</select><br />'
                                	+'';
                    		}
                    		else{
                    			html+='<p><img src="img/hangar2.jpg" class="img_hangar" ship="no" handle="' + data.member[i].handle + '" /></p>';
                    		}
                    		html+='<div class="hangarteam" handle="' + data.member[i].handle + '">'+hangar_teammate+'</div>'
                            +'</center><hr />';
                    		
                    		opt_player+='<option value="'+data.member[i].pseudo+'">'+data.member[i].pseudo+'</option>';
         
                    }
                    html += '</div></div>';
                    
                    $('#select_player_img').html(html2);
                    $('#select_player').html('<div class="ui-field-contain">'
            			    +'<label for="open_fixed_select">Player:</label>'
            			    +'<select name="open_fixed_select" id="open_fixed_select" multiple="multiple" data-native-menu="false">'
            			    + opt_player
            			    +'</select>'
            				+'</div>');
                    //$('#open_fixed_select').selectmenu();
                    $('select').selectmenu();

                    for(var i=0; i< data.team.nb; i++){
                        hangar_team+= '<div class="content_team_hangar"><div class="nb_team_hangar">'+data.team[i].nb+'x</div><img class="img_team_hangar" src="'+data.team[i].img+'" alt="'+data.team[i].name+'" /></div> ';
                    }

                    $('#team_hangar').html($.cookie('team')+': <br />'+hangar_team);
                    $('#member_guilde').html(html);
                    
                    $(".select_select_player_content").parent().css({"width":"200px"});
                    $(".select_select_player_content").parent().parent().css({'display':'inline-block','margin-left':'5px','vertical-align': '82%'});
                    
                    translate();
                } else {
                    $('#member_guilde').html(trad_error_info_org);
                }
            },
            error: function (e) {
                console.log(e.message);
            }
        });
}

function show_group() {

    $.ajax({
            type: 'GET',
            url: 'http://vps36292.ovh.net/mordu/API_2.8.php',
            jsonpCallback: 'API_SC'+API_SC++,
            contentType: "application/json",
            dataType: 'jsonp',
            data: 'action=show_group&team=' + $.cookie('team'),
            async: true,
            beforeSend: function(){           	
                if(connected){
             		 $('.manage_open_open .manage_fixed_open .manage_open_fixed .manage_fixed_fixed').html('<div class="waitingForConnection">'+trad_connection_internet+'</div>');
  	        	}
  	        	else{
  	        		 $('.manage_open_open .manage_fixed_open .manage_open_fixed .manage_fixed_fixed').html('<div class="waitingForConnection">'+trad_error_no_connected+'</div>');
  	        	}
            },
            success: function (data) {
                var html_open_open = '';
                var html_fixed_open='';
                var html_open_fixed='';
                var html_fixed_fixed='';
                var ligne=0;
               
                $('.manage_open_open .manage_fixed_open .manage_open_fixed .manage_fixed_fixed').html();
                
                for(var i = 0; i< data.open_open.nb; i++){
                	html_open_open+='<div>- <span class="info_manage_group" info="'+ligne+'">'+data.open_open[i].name+'</span>  <a context="open_open" name="'+data.open_open[i].name+'" href="index.html" class="delete_group ui-btn ui-shadow ui-corner-all ui-icon-delete ui-btn-icon-notext">Delete</a></div>';
                	html_open_open+='<div id="info_manage_group_'+(ligne++)+'" style="display:none">Max: '+data.open_open[i].max_player+'</div>';
                }
                
                for(var i = 0; i< data.open_fixed.nb; i++){
                	html_open_fixed+='<div>- <span class="info_manage_group" info="'+ligne+'">'+data.open_fixed[i].name+'</span> <a context="open_fixed" name="'+data.open_fixed[i].name+'" href="index.html" class="delete_group ui-btn ui-shadow ui-corner-all ui-icon-delete ui-btn-icon-notext">Delete</a></div>';
                	html_open_fixed+='<div id="info_manage_group_'+(ligne++)+'" style="display:none">';
                	for (var j=0; j< data.open_fixed[i].handle.nb; j++){
                		html_open_fixed+='<p>'+data.open_fixed[i].handle[j].name+'</p>';
                	}
                	html_open_fixed+='</div>';
                }

                for(var i = 0; i< data.fixed_open.nb; i++){
                	html_fixed_open+='<div>- <span class="info_manage_group"  info="'+ligne+'">'+data.fixed_open[i].name+'</name> <a context="fixed_open" name="'+data.fixed_open[i].name+'" href="index.html" class="delete_group ui-btn ui-shadow ui-corner-all ui-icon-delete ui-btn-icon-notext">Delete</a></div>';
                	html_fixed_open+='<div id="info_manage_group_'+(ligne++)+'" style="display:none">';
                	for (var j=0; j< data.fixed_open[i].ship.nb; j++){
                		html_fixed_open+='<p>'+data.fixed_open[i].ship[j].nb+'x '+data.fixed_open[i].ship[j].name+'</p>';
                	}
                	html_fixed_open+='</div>';
                }
                
                for(var i = 0; i< data.fixed_fixed.nb; i++){
                	html_fixed_fixed+='<div>- <span class="info_manage_group"  info="'+ligne+'">'+data.fixed_fixed[i].name+'</span> <a context="fixed_fixed" name="'+data.fixed_fixed[i].name+'" href="index.html" class="delete_group ui-btn ui-shadow ui-corner-all ui-icon-delete ui-btn-icon-notext">Delete</a></div>';
                	html_fixed_fixed+='<div id="info_manage_group_'+(ligne++)+'" style="display:none">';
                	for (var j=0; j< data.fixed_fixed[i].user.nb; j++){
                		html_fixed_fixed+='<p>'+data.fixed_fixed[i].user[j].handle+': '+data.fixed_fixed[i].user[j].ship+'</p>';
                	}
                	html_fixed_fixed+='</div>';
                }
                
                $('.manage_open_open').html(html_open_open);
                $('.manage_open_fixed').html(html_open_fixed);
                $('.manage_fixed_open').html(html_fixed_open);
                $('.manage_fixed_fixed').html(html_fixed_fixed);
                
                translate();
            },
            error: function (e) {
                console.log(e.message);
            }
        });
}

var chart_done=false;
function do_chart(){
	if(chart_done) return false;
	data_pie = new Array();
	
	/* for (var i = 0; i < data.ship.nb_res; i++) {
                	var color = "#" +  Math.floor((1 + Math.random()) * 16777216).toString(16).substr(1);
                	data_pie[i] = {"value": data.ship[i].nb,"color":color};
                	legend+='<span style="width:50px;height:20px;display:inline-block;background:'+color+'">&nbsp;</span> '+data.ship[i].name+' : '+data.ship[i].nb+'<br />';
                }
            	new Chart(ctx_chart).Pie(data_pie,opt_chart);
            	$('#connect_chart').html(legend);
            	chart_done=true;
            	*/
	
	$.ajax({
        type: 'GET',
        url: 'http://vps36292.ovh.net/mordu/API_2.8.php',
        jsonpCallback: 'API_SC'+API_SC++,
        contentType: "application/json",
        dataType: 'jsonp',
        data: 'action=get_localstatship',
        async: true,
        beforeSend: function(){
        	if(connected){
        		 $('#connect_chart').html('<div class="waitingForConnection">'+trad_connection_internet+'</div>');
	        	}
	        	else{
	        		 $('#connect_chart').html('<div class="waitingForConnection">'+trad_error_no_connected+'</div>');
	        	}

        },
        success: function (data) {
            
            $('#connect_chart').html();
            var legend='';


            	
                for (var i = 0; i < data.ship.nb_res; i++) {
                	
                	legend +='<div class="content_team_hangar"><div class="nb_team_hangar">'+data.ship[i].nb+'x</div><img class="img_team_hangar" src="'+data.ship[i].img+'" alt="'+data.ship[i].name+'" /></div>';
                }
                chart_done=true;
                $('#connect_chart').html(legend);
                translate();

        },
        error: function (e) {
            console.log(e.message);
        }
    });

}

function alerte(txt){
	clearTimeout(timer_alert);
	timer_alert=null;
	$('#alert').html(txt);
	$('#alert').slideDown(150);
	timer_alert = setTimeout(function(){
		$('#alert').slideUp(500);
	},6000);
	
}



/**pledge **/

function progress() {

    var val = parseInt($("#percent").html());
    val ++;

    $( "#percent" ).text(val);

	// 39 bar = 100%  => 1 bar = 2,5%
	//nb_bar allumÃ© = 39 * percent / 100
	nb_bar = Math.floor(nb_bars*val / 100);

 
 		for (var i=1; i<=nb_bar; i++){
		 $('#bar_'+i).attr('src','img/on.png');
		}

		//console.log('val '+val+' percent '+percent_max);
    if ( val < percent_max ) {
        setTimeout( progress, 30 );
    }
    else{
        current_anim = false;
    }

}
function progress2() {


	var val2 = parseInt($("#percent2").html());
    val2 ++;

 
	$( "#percent2" ).text(val2);

	nb_bar2 = Math.floor(nb_bars*val2 / 100);
 

		
		for (var i=1; i<=nb_bar2; i++){
		 $('#bar2_'+i).attr('src','img/on.png');
		}

	if ( val2 < percent_max2 ) {
        setTimeout( progress2, 30 );
    }
    else{
        current_anim2 = false;
    }
}

function check_pledge(){
 
    $.ajax({
       type: 'GET',
       url: 'http://vps36292.ovh.net/mordu/API_2.8.php',
       jsonpCallback: 'API_SC'+API_SC++,
        contentType: "application/json",
        dataType: 'jsonp',
        data:'action=funding-goals',
        success: function(data) {
        	
            $('#ret').html(data.current_pledge.us);
            $('#citizens').html(number_format(data.stat.data.fans,0,'.',','));
			$('#citizens_max').html(number_format(parseInt(data.stat.data.fans)+parseInt(data.stat.data.alpha_slots_left),0,'.',','));

            first_check++;
			first_check2++;
            percent_max = data.current_pledge.percentless;
			percent_max2 = Math.round((data.stat.data.fans / (data.stat.data.fans +data.stat.data.alpha_slots_left))*100);

			
            
            if(first_check==1){
            	$('.bars img').attr('src','img/off.png');

                if(percent_max>0){        
                    setTimeout( progress, 3000 );                 
                }
				else{
				 current_anim = false;
				}
                
            }
            else{
                
                if( !current_anim){
                   $( "#percent" ).text( percent_max );
					nb_bar = Math.floor(nb_bars*percent_max / 100);	
					//console.log('percent :'+percent_max+' nb_bar: '+nb_bar);
					for (var i=1; i<=nb_bar; i++){
					  $('#bar_'+i).attr('src','img/on.png');
					}					
                }
				else{
					//console.log('anim in progress...');
				}
				
            }
			
			
			if(first_check2==1){
				$('.bars2 img').attr('src','img/off.png');

				if(percent_max2>0){    				
                    setTimeout( progress2, 3000 );                 
                }
				else{
				 current_anim2 = false;
				}
                
            }
            else{		
				if( !current_anim2){
				   $( "#percent2" ).text( percent_max2 );
					nb_bar2 = Math.floor(nb_bars*percent_max2 / 100);	
					for (var i=1; i<=nb_bar2; i++){
					  $('#bar2_'+i).attr('src','img/on.png');
					}					
                }
				else{
					//console.log('anim2 in progress...');
				}
            }
                 
        },
        error: function(e) {
          
        }
    });
}


function number_format (number, decimals, dec_point, thousands_sep) {
  // http://kevin.vanzonneveld.net
  
  number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
  var n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
    sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
    dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
    s = '',
    toFixedFix = function (n, prec) {
      var k = Math.pow(10, prec);
      return '' + Math.round(n * k) / k;
    };
  // Fix for IE parseFloat(0.55).toFixed(0) = 0;
  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
  if (s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
  }
  if ((s[1] || '').length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length + 1).join('0');
  }
  return s.join(dec);
}

/* web only
setTimeout(function(){
	if(!ready) onDeviceReady();
},4000);
*/