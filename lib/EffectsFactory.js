/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
const cp = require('child_process'),
    Utilities = require("./Utilities"),
    fs = require("fs"),
    TimeStamp = require("./TimeStamp")
module.exports =
/**
 * Generates different effects for clips provided.
 *
 * @author benb
 * @author TeamPopplio
 */
class {
    async spawn(command,options) {
        return new Promise((res,rej) => {
            cp.exec(command,{},(error, stdout, stderr) => {
            }).on("close",()=>{return res(true)})
        })
    }
    setToolBox(tools) {
        this.toolBox = tools;
    }
    pickSound() {
        var fileFilter = (name) => {
            var lowercase = name.toLowerCase();
            if (lowercase.endsWith(".mp3")) 
                return true;
            else 
                return false;
        }
        var files = fs.readdirSync(this.toolBox.SOUNDS).filter(name => fileFilter(name))
        files = files[Math.floor(Math.random() * files.length)] 
        files = files.includes(".mp3") ? files : files+".mp3"
        return files
    }
    pickSource() {
        var fileFilter = (name) => {
            var lowercase = name.toLowerCase();
            if (lowercase.endsWith(".mp4")) 
                return true;
            else 
                return false;
        }
        var files = fs.readdirSync(this.toolBox.SOURCES).filter(name => fileFilter(name))
        files = files[Math.floor(Math.random() * files.length)] 
        files = files.includes(".mp4") ? files : files+".mp4"
        return files
    }
    
    pickMusic() {
        var fileFilter = (name) => {
            var lowercase = name.toLowerCase();
            if (lowercase.endsWith(".mp3")) 
                return true;
            else 
                return false;
        }
        var files = fs.readdirSync(this.toolBox.MUSIC).filter(name => fileFilter(name))
        var files = files[Math.floor(Math.random() * files.length)] 
        files = files.includes(".mp3") ? files : files+".mp3"
        return files
    }

    /* EFFECTS */
    async effect_RandomSound(video,debug,resolution){
        try {
            var temp = this.toolBox.TEMP + "temp.mp4"
            if(fs.existsSync(video) == true)
                fs.renameSync(video,temp);
            var randomSound = this.pickSound()
            var command1 = this.toolBox.FFMPEG
                + " -i " + this.toolBox.TEMP + "temp.mp4"
                + " -i "+ this.toolBox.SOUNDS + randomSound
                + " -filter_complex \"[1:a]volume=1,apad[A];[0:a][A]amerge[out]\""
                + " -ac 2"
                //+ " -c:v copy"
                
                + " -ar 44100"
                + " -vf scale="+resolution[0]+"x"+resolution[1]+",setsar=1:1,fps=fps=30"
                
                + " -map 0:v"
                + " -map [out]"
                + " -y " + video;
            await this.spawn(command1).then(()=>{
                if(fs.existsSync(temp) == true)
                    fs.unlinkSync(temp);
                return true;
            })   
        } catch (ex) {console.error(ex);return false}
    }   
    async effect_RandomSoundMute(video,debug,resolution){
        try {
            var randomSound = this.pickSound();
            var soundLength = 0
            await this.toolBox.getLength(this.toolBox.SOUNDS+randomSound).then(async length=> {
                length = length.streams[0].duration
                var date = new Date(1970,0,1)
                    date.setMilliseconds(length*1000)
                length = new TimeStamp().setup(date)
                if(debug)
                    console.log("Doing a mute now. " + randomSound + " length: " + length.getTimeStamp() + ".");
                //Scanner userInput = new Scanner(System.in);
                //String input = userInput.nextLine();
                
                //if (!input.isEmpty()) {
                    var temp = this.toolBox.TEMP + "temp.mp4"
                    var temp2 = this.toolBox.TEMP + "temp2.mp4"
                    if(fs.existsSync(video) == true) {
                        fs.renameSync(video,temp);
                    }
                    if(fs.existsSync(temp2) == true)
                        fs.unlinkSync(temp2);
                    var command1 = this.toolBox.FFMPEG
                            + " -i " + this.toolBox.TEMP + "temp.mp4"
                            + " -ar 44100"
                            + " -vf scale="+resolution[0]+"x"+resolution[1]+",setsar=1:1,fps=fps=30"
                            + " -af \"volume=0\" -y " + this.toolBox.TEMP + "temp2.mp4",
                        command2 = this.toolBox.FFMPEG
                            + " -i " + this.toolBox.TEMP + "temp2.mp4"
                            + " -i \"" + this.toolBox.SOUNDS +""+randomSound+"\""
                            + " -to "+length.getTimeStamp()
                            + " -ar 44100"
                            + " -vf scale="+resolution[0]+"x"+resolution[1]+",setsar=1:1,fps=fps=30"
                            + " -filter_complex \"[1:a]volume=1,apad[A]; [0:a][A]amerge[out]\" -ac 2 -map 0:v -map [out] -y " + video;
                    var oh = this
                    await this.spawn(command1).then(async function(){
                        await oh.spawn(command2).then(()=>{
                            if(fs.existsSync(temp) == true)
                                fs.unlinkSync(temp);
                            if(fs.existsSync(temp2) == true)
                                fs.unlinkSync(temp2);
                            return true;
                        })
                    })   
                //}
                //System.out.println("Did a mute sfx. Type anything to verify.");
            })
        } catch (ex) {console.error(ex);return false}
    }   
    async effect_Reverse(video,debug,resolution){
        try {
            if(debug)
                console.log("Doing a reverse now.");
            //Scanner userInput = new Scanner(System.in);
            //String input = userInput.nextLine();
            
            //if (!input.isEmpty()) {
                var temp = this.toolBox.TEMP + "temp.mp4"
                var temp2 = this.toolBox.TEMP + "temp2.mp4"
                if(fs.existsSync(video) == true) {
                    fs.renameSync(video,temp);
                }
                if(fs.existsSync(temp2) == true)
                    fs.unlinkSync(temp2);
                var command1 = this.toolBox.FFMPEG
                    + " -i " + this.toolBox.TEMP + "temp.mp4 -map 0"
                    + " -ar 44100"
                    + " -vf scale="+resolution[0]+"x"+resolution[1]+",setsar=1:1,fps=fps=30"
                    + " -af \"areverse\" -y " + this.toolBox.TEMP + "temp2.mp4",
                command2 = this.toolBox.FFMPEG
                    + " -i " + this.toolBox.TEMP + "temp2.mp4"
                    + " -ar 44100"
                    + " -vf scale="+resolution[0]+"x"+resolution[1]+",setsar=1:1,fps=fps=30"
                    + " -vf reverse -y " + video;
                var oh = this
                await this.spawn(command1).then(async function(){
                    await oh.spawn(command2).then(()=>{
                        if(fs.existsSync(temp) == true)
                            fs.unlinkSync(temp);
                        if(fs.existsSync(temp2) == true)
                            fs.unlinkSync(temp2);
                        return true;
                    })
                })  
            //}
            //System.out.println("Did a mute sfx. Type anything to verify.");
        } catch (ex) {console.error(ex);return false}
    }  
    
    
    async effect_SpeedUp(video,debug,resolution){
        try {
            var temp = this.toolBox.TEMP + "temp.mp4"
            if(fs.existsSync(video) == true)
                fs.renameSync(video,temp);
            var command1 = this.toolBox.FFMPEG
                + " -i " + temp
                + " -ar 44100"
                + " -vf scale="+resolution[0]+"x"+resolution[1]+",setsar=1:1,fps=fps=30"
                + " -filter:v setpts=0.5*PTS -filter:a atempo=2.0 -y " + video;
            await this.spawn(command1).then(()=>{
                if(fs.existsSync(temp) == true)
                    fs.unlinkSync(temp);
                return true;
            })   
        } catch (ex) {console.error(ex);return false}
    }   
    
    async effect_SlowDown(video,debug,resolution){
        try {
            var temp = this.toolBox.TEMP + "temp.mp4"
            if(fs.existsSync(video) == true)
                fs.renameSync(video,temp);
            var command1 = this.toolBox.FFMPEG
                + " -i " + this.toolBox.TEMP + "temp.mp4"
                + " -ar 44100"
                + " -vf scale="+resolution[0]+"x"+resolution[1]+",setsar=1:1,fps=fps=30"
                + " -filter:v setpts=2*PTS -filter:a atempo=0.5 -y " + video;
            await this.spawn(command1).then(()=>{
                if(fs.existsSync(temp) == true)
                    fs.unlinkSync(temp);
                return true;
            })   
        } catch (ex) {console.error(ex);return false}
    }   
    
    async effect_Chorus(video,debug,resolution){
        try {
            var temp = this.toolBox.TEMP + "temp.mp4"
            if(fs.existsSync(video) == true)
                fs.renameSync(video,temp);
            var command1 = this.toolBox.FFMPEG
                + " -i " + this.toolBox.TEMP + "temp.mp4"
                + " -ar 44100"
                + " -vf scale="+resolution[0]+"x"+resolution[1]+",setsar=1:1,fps=fps=30"
                + " -af chorus=\"0.5:0.9:50|60|40:0.4|0.32|0.3:0.25|0.4|0.3:2|2.3|1.3\" -y " + video;
            await this.spawn(command1).then(()=>{
                if(fs.existsSync(temp) == true)
                    fs.unlinkSync(temp);
                return true;
            })   
        } catch (ex) {console.error(ex);return false}
    }   

    async effect_Vibrato(video,debug,resolution){
        try {
            var temp = this.toolBox.TEMP + "temp.mp4"
            if(fs.existsSync(video) == true)
                fs.renameSync(video,temp);
            var command1 = this.toolBox.FFMPEG
                + " -i " + this.toolBox.TEMP + "temp.mp4"
                + " -ar 44100"
                + " -vf scale="+resolution[0]+"x"+resolution[1]+",setsar=1:1,fps=fps=30"
                + " -af vibrato=f=7.0:d=0.5 -y " + video;
            await this.spawn(command1).then(()=>{
                if(fs.existsSync(temp) == true)
                    fs.unlinkSync(temp);
                return true;
            })   
        } catch (ex) {console.error(ex);return false}
    } 
    
    async effect_LowPitch(video,debug,resolution) {
        try {
            var temp = this.toolBox.TEMP + "temp.mp4"
            if(fs.existsSync(video) == true)
                fs.renameSync(video,temp);
            var command1 = this.toolBox.FFMPEG
                + " -i " + this.toolBox.TEMP + "temp.mp4"
                + " -ar 44100"
                + " -vf scale="+resolution[0]+"x"+resolution[1]+",setsar=1:1,fps=fps=30"
                + " -filter:v setpts=2*PTS -af asetrate=44100*0.5,aresample=44100 -y " + video;
            await this.spawn(command1).then(()=>{
                if(fs.existsSync(temp) == true)
                    fs.unlinkSync(temp);
                return true;
            })   
        } catch (ex) {console.error(ex);return false}
    }

    async effect_HighPitch(video,debug,resolution) {
        try {
            var temp = this.toolBox.TEMP + "temp.mp4"
            if(fs.existsSync(video) == true)
                fs.renameSync(video,temp);
            var command1 = this.toolBox.FFMPEG
                + " -i " + this.toolBox.TEMP + "temp.mp4"
                + " -ar 44100"
                + " -vf scale="+resolution[0]+"x"+resolution[1]+",setsar=1:1,fps=fps=30"
                + " -filter:v setpts=0.5*PTS -af asetrate=44100*2,aresample=44100 -y " + video;
            await this.spawn(command1).then(()=>{
                if(fs.existsSync(temp) == true)
                    fs.unlinkSync(temp);
                return true;
            })   
        } catch (ex) {console.error(ex);return false}
    }
    
    async effect_Dance(video,debug,resolution){
        try {
            var temp = this.toolBox.TEMP + "temp.mp4"
            var temp2 = this.toolBox.TEMP + "temp2.mp4"
            var temp3 = this.toolBox.TEMP + "temp3.mp4"
            var temp4 = this.toolBox.TEMP + "temp4.mp4"
            var temp5 = this.toolBox.TEMP + "temp5.mp4"
            var temp6 = this.toolBox.TEMP + "temp6.mp4"
            var temp7 = this.toolBox.TEMP + "temp7.mp4"
            var randomSound = this.pickMusic();
            if(fs.existsSync(video) == true)
                fs.renameSync(video,temp);
            if(fs.existsSync(temp2) == true)
                fs.unlinkSync(temp2);
            if(fs.existsSync(temp3) == true)
                fs.unlinkSync(temp3);
            if(fs.existsSync(temp4) == true)
                fs.unlinkSync(temp4);
            if(fs.existsSync(temp5) == true)
                fs.unlinkSync(temp5);
            if(fs.existsSync(temp6) == true)
                fs.unlinkSync(temp6);
            if(fs.existsSync(temp7) == true)
                fs.unlinkSync(temp7);
            var commands = []
            var randomTime = this._randomIntFromInterval(3,9);
            var randomTime2 = this._randomIntFromInterval(0,1);
            commands.push(this.toolBox.FFMPEG
                + " -i " + this.toolBox.TEMP + "temp.mp4 -map 0"// -c:v copy"
                + " -ar 44100"  
                + " -to 00:00:0"+randomTime2+"." + randomTime
                + " -vf scale="+resolution[0]+"x"+resolution[1]+",setsar=1:1"
                + " -an"
                + " -y " + this.toolBox.TEMP + "temp2.mp4");
            
            commands.push(this.toolBox.FFMPEG
                    + " -i " + this.toolBox.TEMP + "temp2.mp4 -map 0"// -c:v copy"
                    + " -ar 44100"
                    + " -vf reverse,scale="+resolution[0]+"x"+resolution[1]+",setsar=1:1"
                    + " -y " + this.toolBox.TEMP + "temp3.mp4");
            
            commands.push(this.toolBox.FFMPEG
                    + " -i " + this.toolBox.TEMP + "temp3.mp4"
                    + " -ar 44100"
                    + " -vf reverse,scale="+resolution[0]+"x"+resolution[1]+",setsar=1:1"
                    + " -y " + this.toolBox.TEMP + "temp4.mp4");
            
            commands.push(this.toolBox.FFMPEG
                    + " -i " + this.toolBox.TEMP + "temp3.mp4"
                    + " -i " + this.toolBox.TEMP + "temp4.mp4"
                    + " -filter_complex \"[0:v:0][1:v:0][0:v:0][1:v:0][0:v:0][1:v:0][0:v:0][1:v:0]concat=n=8:v=1[outv]\""
                    + " -map \"[outv]\""
                    + " -c:v libx264 -shortest"
                    + " -y " + this.toolBox.TEMP + "temp5.mp4");
            
            commands.push(this.toolBox.FFMPEG
                    + " -i " + this.toolBox.TEMP + "temp5.mp4"
                    + " -map 0"
                    + " -ar 44100"
                    + " -vf \"setpts=0.5*PTS,scale="+resolution[0]+"x"+resolution[1]+",setsar=1:1\""
                    + " -af \"atempo=2.0\""
                    + " -shortest"
                    + " -y " + this.toolBox.TEMP + "temp6.mp4");
            
            commands.push(this.toolBox.FFMPEG
                    + " -i " + this.toolBox.TEMP + "temp6.mp4"
                    + " -i " + this.toolBox.MUSIC + randomSound
                    + " -c:v libx264"
                    + " -map 0:v:0 -map 1:a:0"
                    + " -vf \"scale="+resolution[0]+"x"+resolution[1]+",setsar=1:1,fps=fps=30\""
                    + " -shortest"
                    + " -y " + video);
            for (var i=0;i<commands.length;i++) {
                await this.spawn(commands[i])
            }
            if(fs.existsSync(temp) == true)
                fs.unlinkSync(temp);
            if(fs.existsSync(temp2) == true)
                fs.unlinkSync(temp2);
            if(fs.existsSync(temp3) == true)
                fs.unlinkSync(temp3);
            if(fs.existsSync(temp4) == true)
                fs.unlinkSync(temp4);
            if(fs.existsSync(temp5) == true)
                fs.unlinkSync(temp5);
            if(fs.existsSync(temp6) == true)
                fs.unlinkSync(temp6);
            if(fs.existsSync(temp7) == true)
                fs.unlinkSync(temp7);
            return true;
            
        } catch (ex) {console.error(ex);return false}
    }  
    
    async  effect_Squidward(video,debug,resolution){
        if(debug)
            console.log("Not implemented")
        return true;
        /*
        System.out.println(new Object() {}.getClass().getEnclosingMethod().getName() + " initiated");
        try {
            File in = new File(video);
            
            File temp = new File(toolBox.TEMP + "temp.mp4"); //og file
            
            // final result is backwards & forwards concatenated with music
            
            if (in.exists())
                in.renameTo(temp);
            
            ArrayList<String> commands = new ArrayList<String>();

            commands.add(toolBox.FFMPEG
                    + " -i " + toolBox.TEMP + "temp.mp4"// -c:v copy"
                    + " -vf \"select=gte(n\\,1)\""
                    + " -vframes 1"
                    + " -y " + toolBox.TEMP + "squidward0.png");
            
            for (int i=1; i<6; i++) { 
                String effect = "";
                int random = _randomIntFromInterval(0,6);
                switch (random) {
                    case 0: 
                        effect = " -flop";
                        break;
                    case 1:
                        effect = " -flip";
                        break;
                    case 2:
                        effect = " -implode -" + _randomIntFromInterval(1,3);
                        break;
                    case 3:
                        effect = " -implode " + _randomIntFromInterval(1,3);
                        break;
                    case 4:
                        effect = " -swirl " + _randomIntFromInterval(1,180);
                        break;
                    case 5:
                        effect = " -swirl -" + _randomIntFromInterval(1,180);
                        break;
                    case 6:
                        effect = " -channel RGB -negate";
                        break;
                    //case 7:
                    //    effect = " -virtual-pixel Black +distort Cylinder2Plane " + _randomIntFromInterval(1,90);
                    //    break;
                }
                commands.add(toolBox.MAGICK
                        + " convert " + toolBox.TEMP + "squidward0.png"
                        + effect
                        + " " + toolBox.TEMP + "squidward" + i + ".png"
                );
            }
            commands.add(toolBox.MAGICK
                    + " convert -size "+resolution[0]+"x"+resolution[1]+" canvas:black " + toolBox.TEMP + "black.png");
            
            if (new File(toolBox.TEMP + "concatsquidward.txt").exists())
                new File(toolBox.TEMP + "concatsquidward.txt").delete();
            PrintWriter writer = new PrintWriter(toolBox.TEMP + "concatsquidward.txt", "UTF-8");
            writer.write
                        ("file 'squidward0.png'\n" +
                        "duration 0.467\n" +
                        "file 'squidward1.png'\n" +
                        "duration 0.434\n" +
                        "file 'squidward2.png'\n" +
                        "duration 0.4\n" +
                        "file 'black.png'\n" +
                        "duration 0.834\n" +
                        "file 'squidward3.png'\n" +
                        "duration 0.467\n" +
                        "file 'squidward4.png'\n" +
                        "duration 0.4\n" +
                        "file 'squidward5.png'\n" +
                        "duration 0.467");
            writer.close();
            
            commands.add(toolBox.FFMPEG
                    + " -f concat"
                    + " -i " + toolBox.TEMP + "concatsquidward.txt"
                    + " -i " + toolBox.RESOURCES + "squidward/music.wav"
                    + " -map 0:v:0 -map 1:a:0"
                    + " -vf \"scale="+resolution[0]+"x"+resolution[1]+",setsar=1:1\""
                    + " -pix_fmt yuv420p"
                    + " -y " + video);
            
            //String command = "lib/ffmpeg -i " + toolBox.TEMP + "temp.mp4 -i sounds/"+randomSound+" -c:v copy -map 0:v:0 -map 1:a:0 -shortest "+ video;
            for (String command : commands) {
                System.out.println("Executing: " + command);
                CommandLine cmdLine = CommandLine.parse(command);
                DefaultExecutor executor = new DefaultExecutor();
                int exitValue = executor.execute(cmdLine);
            }
            
            temp.delete();
            for (int i=0; i<6; i++) {
                new File(toolBox.TEMP + "squidward"+i+".png").delete();
            }
            new File(toolBox.TEMP + "black.png").delete();
            new File(toolBox.TEMP + "concatsquidward.txt").delete();
        } catch (Exception ex) {System.out.println(new Object() {}.getClass().getEnclosingMethod().getName() + "\n" +ex);}*/
    }
    
    _randomIntFromInterval(min,max) {
        return Math.floor(Math.random()*(max-min)+min);
    }
}
