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


$( document ).on( "pagecreate", "#page", function() {
	$.event.special.swipe.horizontalDistanceThreshold =100;
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

function onDeviceReady() {
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

        display_ship();
        
        $('#left-menu').click(function(){
        	console.log('left clicked');
        	clearTimeout(help_menu_left);
            help_menu_left = -1;
            $.cookie('tuto',1);
        });

        if ($.cookie('switch-theme') == '1') {
            console.log('cookie make click');
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
            if (page == 'manage_ship') {
            	allow_swipe = false;
                setTimeout(function () {
                    $('.slide').trigger("resize");
                    $('.save_ship').button();
                    $('.save_ship').parent().width(175);
                }, 1000);
            }
            else if(page =='stat'){
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


     
            	
            }


            $('#close_left_menu').trigger('click');
            return false;
        });
        
                

        $('.ui-flipswitch').click(function () {
            console.log('switch auto:' + auto_switch + ' cookie' + $.cookie('switch-theme'));
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

        $('body').delegate('#confirm_btn_1', 'click', function () {
            console.log('btn1 clicked');
            if ($(this).attr('action') == 'confirm_ship') {
                console.log('confirm_ship=>saveship');
                save_ship();
            }
            else{
                console.log('hide?');
                $('#confirm').hide();
            }
        });
        
        $('body').delegate('.img_team_team, .img_team_hangar','click', function(){
        	alerte('<img src="'+$(this).attr('src')+'"/><br />' +$(this).attr('alt'));
        });


        $('body').delegate('.save_ship', 'click', function () {
            name_ship = $(this).attr('ship');
            nb_ship= $('#slider').val();

            $( "#popupDialog h1" ).html(trad_save_nb_ship);
            $('#confirm_btn_1').html(trad_confirm_yes);
            $('#confirm_btn_1').attr('action','confirm_ship');
            $('#confirm_btn_2').html(trad_confirm_no);
            $( "#popupDialog h3" ).html(trad_confirm_nb_ship.replace('$0', $.cookie('pseudo')).replace('$1',nb_ship).replace('$2',name_ship) + '? ');

            $( "#popupDialog" ).popup("open");
        });

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
        	           alerte(trad_connection_internet);
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
        	           alerte(trad_connection_internet);
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
                    $('#info_pseudo').html('<div class="waitingForConnection">'+trad_connection_internet+'</div>');
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
	                        console.log('width:'+width+' font:'+font);
	                        font--;
                        }
                        while(width>178 && font>9);
                        ctx.fillText( upp_pseudo,120,110);

                        while(data.number.length<8){
                            data.number= '0'+data.number;

                        }
                        ctx.save();
                        ctx.font='10px orbitron';
                        ctx.fillStyle='#151515';
                        ctx.translate(150, 94.5);
                        ctx.rotate(Math.PI/2);
                        ctx.fillText(data.number, -50, 147);
                        ctx.restore();
                        
                        

                        var img = new Image();   // Crée un nouvel objet Image
                        img.src = data.avatar; // Définit le chemin vers sa source
                        img.onload = function(){
                        	//ctx.drawImage(img, 220, 25,76,76);
                        	ctx.drawImage(img, 0, 0, img.width, img.height, 217, 27, 76, 61);
                        };
                        
                        if(data.team.logo){
	                        var img2 = new Image();
	                        img2.src = data.team.logo;
	                        img2.onload = function() {
	                            ctx.save();
	                            ctx.globalAlpha = 0.3;
	                            ctx.drawImage(img2, 0, 0, img2.width, img2.height, 125, 27, 76, 61);
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
                        display_hangar();
                        if(data.team.name) info_orga();
                     

                    }
                    else if(data.err=='MDP_REQUIRED_HANDLE'){ //handle first more important than team
                        console.log(data.err);
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
           alerte(trad_connection_internet);
            console.log('before ajax');
        },
        success: function (data) {
            console.log('after ajax');
            alerte(nb_ship+ 'x '+name_ship+ ' '+trad_saved);
            display_hangar();
            info_orga();
            console.log('confirm hide');
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
            data: 'action=get_ship&handle='+ $.cookie('handle'),
            async: true,
            success: function (data) {
                $('#your_hangar').html('<div class="ui-corner-all custom-corners"><div class="ui-bar ui-bar-'+theme+'"><h3 trad="trad_your_ships"></h3></div><div class="ui-body ui-body-'+theme+'">');
                var html = $.cookie('pseudo')+':<br />';
                for (var i = 0; i < data.ship.nb_res; i++) {
                    html +=  '<div class="content_team_hangar"><div class="nb_team_hangar">'+data.ship[i].nb +'x</div><img class="img_team_hangar" src="'+data.ship[i].img+'" alt="'+data.ship[i].name+'" /></div> ';
                   
                                   
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
    $('#member_ship').html(
            '<div class="ui-corner-all custom-corners"><div class="ui-bar ui-bar-'+theme+'"><h3 trad="trad_manage_ship"></h3></div><div class="ui-body ui-body-'+theme+'">'+
            '<div class="slider"><ul class="slides"><li trad="trad_loading_your_ship"></li></ul></div></div></div>');

    var date_save = new Date();
    var check_cook = date_save.getMonth()+1+''+date_save.getFullYear();

    $.ajax({
            type: 'GET',
            url: 'http://vps36292.ovh.net/mordu/API_2.8.php',
            jsonpCallback: 'API_SC'+API_SC++,
            contentType: "application/json",
            dataType: 'jsonp',
            data: 'action=ship',
            async: true,
            success: function (data) {
                $('#ship, .slides').html('');
                var html = '';
                var check_banu = false;
                var check_karthu = false;
                var check_mustang = false;
                for (var i = 0; i < data.ship.total; i++) {
                    html += ' <li class="slide"><img src="https://robertsspaceindustries.com/rsi/static/images/game/ship-specs/'
                        + data.ship[i].imageurl  + '" /><br />'
                        + data.ship[i].title
                        + ' ('   + data.ship[i].manufacturer   + ')<br />'
                        + trad_max_crew  + ': '
                        + data.ship[i].maxcrew
                        + '<br />'
                        + trad_role +': ' + data.ship[i].role
                        + '<br /><input type="button" class="save_ship" ship="'
                        + data.ship[i].title  + '" value="'
                        + trad_save_nb_ship + '" />' + '</li>';
                    if(data.ship[i].title.match('banu')){
                        check_banu = true;
                    }
                    else if(data.ship[i].title.match('karthu')){
                        check_karthu = true;
                    }
                    else if(data.ship[i].title.match('mustang')){
                        check_mustang = true;
                    }
                    if(!$.cookie(check_cook) ) save_infoship(data.ship[i].title, 'https://robertsspaceindustries.com/rsi/static/images/game/ship-specs/'+data.ship[i].imageurl, data.ship[i].role, data.ship[i].maxcrew);
                }

                if(!check_banu){
                    html +=' <li class="slide"><img src="img/banu.jpg" /><br />Banu Merchantman (Birc)<br />'
                        + trad_max_crew  + ': 4<br />'
                        + trad_role +': Merchant Clipper'
                        + '<br /><input type="button" class="save_ship" ship="Banu Merchantman" value="'
                        + trad_save_nb_ship + '" />' + '</li>';
                }
                if(!check_karthu){
                    html +=' <li class="slide"><img src="img/karthu.jpg" /><br />Xi’An Karthu<br />'
                        + trad_max_crew  + ': 1<br />'
                        + trad_role +': Scout'
                        + '<br /><input type="button" class="save_ship" ship="Xi’An Karthu" value="'
                        + trad_save_nb_ship + '" />' + '</li>';
                }
                if(!check_mustang){
                    html +=' <li class="slide"><img src="img/mustang.jpg" /><br />Mustang (Consolidated Outland)<br />'
                        + trad_max_crew  + ': 1<br />'
                        + trad_role +': Light Fighter'
                        + '<br /><input type="button" class="save_ship" ship="Mustang" value="'
                        + trad_save_nb_ship + '" />' + '</li>';
                }

                $('.slides').html(html);
                $('#nb_ship').show();

                $('.slider').glide({
                    autoplay: false
                });
                translate();
                $.cookie(check_cook,1);
                $('.slider-arrow--left').html('<');
                $('.slider-arrow--right').html('&gt;');
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
            data: 'action=org&team=' + $.cookie('team') + '&page=1',
            async: true,
            beforeSend: function(){
                $('#member_guilde').html('<div class="waitingForConnection">'+trad_connection_internet+'</div>');
            },
            success: function (data) {
                var html = '<div class="ui-corner-all custom-corners"><div class="ui-bar ui-bar-'+theme+'"><h3 trad="trad_your_team"></h3></div><div class="ui-body ui-body-'+theme+'">';
                var hangar_teammate='';
                var hangar_team ='';
                $('#member_guilde').html();

                if (data.member.nb > 0) {
                	if(data.member.nb>249) data.member.nb = 249; //TODO limite max 249
                    for (var i = 0; i < data.member.nb; i++) {
                    	hangar_teammate='';
                    	for(var j=0; j<data.member[i].ship.nb;j++){
                    		hangar_teammate+= '<div class="content_team_hangar"><div class="nb_team_hangar">'+data.member[i].ship[j].nb +'x</div><img class="img_team_team" src="'+data.member[i].ship[j].img+'" alt="'+data.member[i].ship[j].name+'" /></div> ';
                    	}
                    	//hangar_teammate = hangar_teammate.substring(0, hangar_teammate.length - 2);
                        
                    	html += '<div><img class="member_guilde_avatar" src="http://robertsspaceindustries.com'+ data.member[i].avatar  + '" style="'+(data.member[i].ship.nb>0?'border-color:#2ad':'border-color:gray')+'" />'
                            + ' <div class="display_pseudo">' + data.member[i].pseudo + '</div><div class="display_handle"> ' + data.member[i].handle + '</div>'
                            
                            + '<div>'+data.member[i].title+'</div>'
                            + '<div style="clear:both"></div><h2 trad="trad_role"></h2><ul>'
                            + data.member[i].role.replace('None','- '+trad_none)
                            + '</ul></div>'
                            +'<div class="hangarteam" handle="' + data.member[i].handle + '">'+hangar_teammate+'</div>'
                            +'<hr />';
                            
                    }
                    html += '</div></div>';

                    for(var i=0; i< data.team.nb; i++){
                        hangar_team+= '<div class="content_team_hangar"><div class="nb_team_hangar">'+data.team[i].nb+'x</div><img class="img_team_hangar" src="'+data.team[i].img+'" alt="'+data.team[i].name+'" /></div> ';
                    }

                    $('#team_hangar').html($.cookie('team')+': <br />'+hangar_team);
                    $('#member_guilde').html(html);
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
        data: 'action=get_statship',
        async: true,
        beforeSend: function(){
            $('#connect_chart').html('<div class="waitingForConnection">'+trad_connection_internet+'</div>');
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
			percent_max2 = data.stat.data.alpha_slots_percentage;

			
            
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