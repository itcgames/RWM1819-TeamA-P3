class Square
{

    constructor(x, y, w, h, color)
    {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.color = color
    }

    render(ctx)
    {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}